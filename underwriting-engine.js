const MONTHS_IN_YEAR = 12;

function paymentForLoan(principal, annualRatePct, amortYears) {
  if (principal <= 0) return 0;

  const monthlyRate = annualRatePct / 100 / MONTHS_IN_YEAR;
  const periods = amortYears * MONTHS_IN_YEAR;

  if (monthlyRate === 0) return principal / periods;

  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -periods));
}

function annualizeMonthlyRate(monthlyRate) {
  return Math.pow(1 + monthlyRate, MONTHS_IN_YEAR) - 1;
}

// The IRR estimator uses a Newton-Raphson pass over monthly cash flows so we can
// annualize the result for comparison against the user's target return hurdles.
function estimateIrr(cashFlows, initialGuess = 0.012) {
  let guess = initialGuess;

  for (let iteration = 0; iteration < 100; iteration += 1) {
    let npv = 0;
    let derivative = 0;

    cashFlows.forEach((cashFlow, month) => {
      const discount = Math.pow(1 + guess, month);
      npv += cashFlow / discount;

      if (month > 0) {
        derivative -= (month * cashFlow) / (discount * (1 + guess));
      }
    });

    if (Math.abs(npv) < 0.0001) return guess;
    if (Math.abs(derivative) < 0.000001) break;

    guess -= npv / derivative;

    if (guess <= -0.99) {
      guess = -0.99;
    }
  }

  return Number.NaN;
}

// Debt schedules are intentionally isolated from the rest of the model so a later
// backend service or spreadsheet import can replace loan behavior without rewriting the UI.
function buildLoanSchedule({
  principal,
  annualRatePct,
  amortYears,
  months,
  ioMonths = 0
}) {
  const payment = paymentForLoan(principal, annualRatePct, amortYears);
  const monthlyRate = annualRatePct / 100 / MONTHS_IN_YEAR;
  const schedule = [];
  let balance = principal;

  for (let month = 0; month < months; month += 1) {
    const interest = balance * monthlyRate;
    const debtService = month < ioMonths ? interest : payment;
    const principalPaydown = Math.max(debtService - interest, 0);

    balance = Math.max(balance - principalPaydown, 0);

    schedule.push({
      debtService,
      interest,
      principalPaydown,
      balance
    });
  }

  return schedule;
}

// Investor capital is currently summarized at the class/member level rather than
// individual investor records because user-specific ledgering is deferred until multi-user phases.
function inferInvestorCapital(inputs) {
  const lpCapital = inputs.lpClasses.reduce(
    (total, lpClass) => total + lpClass.commitment * lpClass.classCount,
    0
  );

  return {
    lpCapital,
    gpCapital: inputs.gpEquityContribution,
    totalEquity: lpCapital + inputs.gpEquityContribution
  };
}

// This waterfall intentionally follows the requested ordering:
// preferred return when enabled, return of LP capital, return of GP capital,
// then residual profit split through either promote logic or straight pro rata.
function distributeProfit({
  cashAvailable,
  prefAccrued,
  lpCapitalOutstanding,
  gpCapitalOutstanding,
  lpPrefRate,
  gpPromoteShare,
  waterfallMode
}) {
  const distribution = {
    lpPrefPaid: 0,
    lpCapitalReturned: 0,
    gpCapitalReturned: 0,
    gpProfitShare: 0,
    lpProfitShare: 0,
    remainingCash: cashAvailable
  };

  if (cashAvailable <= 0) {
    return distribution;
  }

  if (waterfallMode === "pref-and-promote") {
    distribution.lpPrefPaid = Math.min(distribution.remainingCash, prefAccrued);
    distribution.remainingCash -= distribution.lpPrefPaid;
  }

  distribution.lpCapitalReturned = Math.min(distribution.remainingCash, lpCapitalOutstanding);
  distribution.remainingCash -= distribution.lpCapitalReturned;

  distribution.gpCapitalReturned = Math.min(distribution.remainingCash, gpCapitalOutstanding);
  distribution.remainingCash -= distribution.gpCapitalReturned;

  const profitPool = Math.max(distribution.remainingCash, 0);

  if (waterfallMode === "pref-and-promote") {
    distribution.gpProfitShare = profitPool * (gpPromoteShare / 100);
    distribution.lpProfitShare = profitPool - distribution.gpProfitShare;
  } else {
    const totalCapital = lpCapitalOutstanding + gpCapitalOutstanding || 1;
    distribution.lpProfitShare = profitPool * (lpCapitalOutstanding / totalCapital);
    distribution.gpProfitShare = profitPool - distribution.lpProfitShare;
  }

  distribution.remainingCash = 0;

  return distribution;
}

function runScenarioUnderwriting(inputs, scenario) {
  const holdMonths = inputs.holdYears * MONTHS_IN_YEAR;
  const totalUnits = inputs.unitCount;
  const targetOccupancy = Math.min(Math.max(inputs.economicOccupancy - scenario.vacancyDelta, 0), 99.5) / 100;
  const leaseUpUnits = scenario.leaseUpPerMonth;
  const renovatedUnitsPerMonth = scenario.renoUnitsPerMonth;
  const effectiveRentGrowth = (inputs.rentGrowth + scenario.rentGrowthDelta) / 100;
  const effectiveExpenseGrowth = (inputs.expenseGrowth + scenario.expenseGrowthDelta) / 100;
  const exitCap = (inputs.exitCapRate + scenario.exitCapDelta) / 100;
  const saleCostsPct = inputs.saleCostsPct / 100;

  const seniorSchedule = buildLoanSchedule({
    principal: inputs.loanAmount,
    annualRatePct: inputs.interestRate,
    amortYears: inputs.amortYears,
    months: holdMonths,
    ioMonths: inputs.ioMonths
  });

  const sellerCarrySchedule = buildLoanSchedule({
    principal: inputs.sellerCarryAmount,
    annualRatePct: inputs.sellerCarryRate,
    amortYears: inputs.sellerCarryAmortYears,
    months: holdMonths,
    ioMonths: 0
  });

  const investorCapital = inferInvestorCapital(inputs);
  const initialEquity = Math.max(
    inputs.purchasePrice + inputs.closingCosts - inputs.loanAmount - inputs.sellerCarryAmount,
    0
  );
  const lpCapitalRequired = Math.max(initialEquity - inputs.gpEquityContribution, 0);
  const lpCapitalOutstanding = Math.max(Math.min(lpCapitalRequired, investorCapital.lpCapital), 0);
  let remainingLpCapital = lpCapitalOutstanding;
  let remainingGpCapital = Math.max(initialEquity - remainingLpCapital, 0);
  let accruedLpPref = 0;

  const monthlyCashFlows = [-initialEquity];
  const monthlyRows = [];
  const annualRows = [];

  let occupiedUnits = totalUnits * targetOccupancy;
  let renovatedUnits = 0;
  let latestNoi = 0;
  let refiDistributionSummary = null;

  // The monthly loop is the core of the underwriting engine. It produces the
  // annual rollups, event-based refinance logic, and terminal sale distribution.
  for (let month = 0; month < holdMonths; month += 1) {
    const yearIndex = Math.floor(month / MONTHS_IN_YEAR);
    const monthInYear = month % MONTHS_IN_YEAR;
    const rentGrowthFactor = Math.pow(1 + effectiveRentGrowth, yearIndex);
    const expenseGrowthFactor = Math.pow(1 + effectiveExpenseGrowth, yearIndex);

    occupiedUnits = Math.min(
      totalUnits * targetOccupancy,
      occupiedUnits + Math.max(leaseUpUnits, 0)
    );
    renovatedUnits = Math.min(totalUnits, renovatedUnits + Math.max(renovatedUnitsPerMonth, 0));

    const avgRent = inputs.avgRent * rentGrowthFactor;
    const marketRent = inputs.marketRent * rentGrowthFactor;
    const renovatedRentLift = Math.max(
      inputs.renoPremium + scenario.renoPremiumDelta,
      0
    );
    const effectiveUnitRent =
      avgRent + ((marketRent - avgRent) * renovatedUnits) / Math.max(totalUnits, 1) +
      (renovatedUnits / Math.max(totalUnits, 1)) * renovatedRentLift;

    const grossPotentialRent = totalUnits * effectiveUnitRent;
    const vacancyLoss = grossPotentialRent * (1 - targetOccupancy);
    const otherIncome = totalUnits * (inputs.otherIncomePerUnit + scenario.otherIncomeDelta);
    const effectiveGrossIncome = grossPotentialRent - vacancyLoss + otherIncome;

    const operatingExpenses =
      totalUnits * inputs.opexPerUnit * expenseGrowthFactor +
      ((inputs.propertyTaxes + inputs.insurance + inputs.payroll + inputs.repairs) / MONTHS_IN_YEAR) *
        expenseGrowthFactor +
      (effectiveGrossIncome * inputs.managementFee) / 100 +
      (totalUnits * inputs.replacementReserve * expenseGrowthFactor) / MONTHS_IN_YEAR;

    const noi = effectiveGrossIncome - operatingExpenses;
    latestNoi = noi;

    const seniorDebt = seniorSchedule[month] ?? { debtService: 0, balance: 0 };
    const sellerDebt = sellerCarrySchedule[month] ?? { debtService: 0, balance: 0 };
    const debtService = seniorDebt.debtService + sellerDebt.debtService;
    let cashFlowBeforeTax = noi - debtService;
    let refinanceProceeds = 0;

    const isRefiMonth = inputs.refiYear > 0 && month === inputs.refiYear * MONTHS_IN_YEAR - 1;

    if (isRefiMonth) {
      // Refinance replaces the original debt structure in this prototype and
      // pays fees before any return-of-capital or profit distributions occur.
      const impliedValue = (noi * MONTHS_IN_YEAR) / Math.max(inputs.refiCapRate / 100, 0.0001);
      const newLoanAmount = impliedValue * (inputs.refiLtv / 100);
      const debtPayoff = seniorDebt.balance + sellerDebt.balance;
      const prepayPenalty = debtPayoff * (inputs.prepayPenaltyPct / 100);
      const capitalTransactionFee = newLoanAmount * (inputs.capitalTransactionFeePct / 100);

      refinanceProceeds = Math.max(
        newLoanAmount - debtPayoff - prepayPenalty - capitalTransactionFee,
        0
      );

      const refiDistribution = distributeProfit({
        cashAvailable: refinanceProceeds,
        prefAccrued: accruedLpPref,
        lpCapitalOutstanding: remainingLpCapital,
        gpCapitalOutstanding: remainingGpCapital,
        lpPrefRate: inputs.lpPrefRate,
        gpPromoteShare: inputs.gpPromoteShare,
        waterfallMode: inputs.waterfallMode
      });

      accruedLpPref = Math.max(accruedLpPref - refiDistribution.lpPrefPaid, 0);
      remainingLpCapital = Math.max(remainingLpCapital - refiDistribution.lpCapitalReturned, 0);
      remainingGpCapital = Math.max(remainingGpCapital - refiDistribution.gpCapitalReturned, 0);
      refiDistributionSummary = refiDistribution;
      cashFlowBeforeTax += refinanceProceeds;
    }

    accruedLpPref +=
      (remainingLpCapital * (inputs.lpPrefRate / 100)) / MONTHS_IN_YEAR;

    monthlyCashFlows.push(cashFlowBeforeTax);
    monthlyRows.push({
      month: month + 1,
      grossPotentialRent,
      otherIncome,
      effectiveGrossIncome,
      operatingExpenses,
      noi,
      debtService,
      cashFlowBeforeTax,
      occupiedUnits,
      renovatedUnits
    });

    if (monthInYear === MONTHS_IN_YEAR - 1) {
      const lastYearRows = monthlyRows.slice(month - 11, month + 1);
      const yearlyCashFlow = lastYearRows.reduce((total, row) => total + row.cashFlowBeforeTax, 0);
      const yearlyNoi = lastYearRows.reduce((total, row) => total + row.noi, 0);
      const yearlyDebt = lastYearRows.reduce((total, row) => total + row.debtService, 0);

      annualRows.push({
        year: yearIndex + 1,
        noi: yearlyNoi,
        debtService: yearlyDebt,
        cashFlowBeforeTax: yearlyCashFlow
      });
    }
  }

  const terminalValue = (latestNoi * MONTHS_IN_YEAR) / Math.max(exitCap, 0.0001);
  const terminalSaleCosts = terminalValue * saleCostsPct;
  const endingSeniorBalance = seniorSchedule.at(-1)?.balance ?? 0;
  const endingSellerBalance = sellerCarrySchedule.at(-1)?.balance ?? 0;
  const saleNetCash = Math.max(
    terminalValue - terminalSaleCosts - endingSeniorBalance - endingSellerBalance,
    0
  );

  const saleDistribution = distributeProfit({
    cashAvailable: saleNetCash,
    prefAccrued: accruedLpPref,
    lpCapitalOutstanding: remainingLpCapital,
    gpCapitalOutstanding: remainingGpCapital,
    lpPrefRate: inputs.lpPrefRate,
    gpPromoteShare: inputs.gpPromoteShare,
    waterfallMode: inputs.waterfallMode
  });

  monthlyCashFlows[monthlyCashFlows.length - 1] += saleNetCash;
  if (annualRows.length > 0) {
    annualRows[annualRows.length - 1].cashFlowBeforeTax += saleNetCash;
  }

  const totalDistributions = monthlyCashFlows.slice(1).reduce((sum, value) => sum + value, 0);
  const monthlyIrr = estimateIrr(monthlyCashFlows);
  const annualizedIrr = Number.isNaN(monthlyIrr) ? Number.NaN : annualizeMonthlyRate(monthlyIrr);
  const yearOne = annualRows[0] ?? { cashFlowBeforeTax: 0, noi: 0, debtService: 0 };
  const debtBasis = inputs.loanAmount + inputs.sellerCarryAmount;
  const equityMultiple = initialEquity > 0 ? totalDistributions / initialEquity : 0;
  const annualizedReturn = equityMultiple > 0 ? Math.pow(equityMultiple, 1 / inputs.holdYears) - 1 : 0;
  const breakEvenRatio =
    yearOne.noi + yearOne.debtService > 0
      ? (yearOne.debtService + (yearOne.noi - yearOne.cashFlowBeforeTax)) /
        (yearOne.noi + (yearOne.noi - yearOne.cashFlowBeforeTax))
      : 0;

  return {
    initialEquity,
    annualizedReturn,
    annualizedIrr,
    cashOnCash: initialEquity > 0 ? yearOne.cashFlowBeforeTax / initialEquity : 0,
    equityMultiple,
    dscr: yearOne.debtService > 0 ? yearOne.noi / yearOne.debtService : 0,
    breakEvenRatio,
    debtYield: debtBasis > 0 ? (yearOne.noi / debtBasis) : 0,
    baselineCapRate:
      inputs.purchasePrice > 0
        ? (yearOne.noi / inputs.purchasePrice)
        : 0,
    monthlyRows,
    annualRows,
    saleDistribution,
    refiDistributionSummary
  };
}

window.runScenarioUnderwriting = runScenarioUnderwriting;
