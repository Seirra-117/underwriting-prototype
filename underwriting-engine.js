const MONTHS_IN_YEAR = 12;
const QUARTERS_IN_YEAR = 4;

function paymentForLoan(principal, annualRatePct, amortYears) {
  if (principal <= 0 || amortYears <= 0) return 0;

  const monthlyRate = annualRatePct / 100 / MONTHS_IN_YEAR;
  const periods = amortYears * MONTHS_IN_YEAR;

  if (monthlyRate === 0) return principal / periods;

  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -periods));
}

function annualizeMonthlyRate(monthlyRate) {
  return Math.pow(1 + monthlyRate, MONTHS_IN_YEAR) - 1;
}

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

function safeDivide(numerator, denominator) {
  return denominator === 0 ? 0 : numerator / denominator;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createLoan({ name, kind, principal, annualRatePct, amortYears, ioMonths = 0 }) {
  return {
    name,
    kind,
    rate: annualRatePct,
    amortYears,
    ioMonths,
    payment: paymentForLoan(principal, annualRatePct, amortYears),
    monthlyRate: annualRatePct / 100 / MONTHS_IN_YEAR,
    balance: Math.max(principal, 0),
    monthsElapsed: 0
  };
}

function advanceLoanMonth(loan) {
  if (loan.balance <= 0) {
    return {
      interest: 0,
      principalPaid: 0,
      debtService: 0,
      endingBalance: 0,
      kind: loan.kind,
      name: loan.name
    };
  }

  const interest = loan.balance * loan.monthlyRate;
  const debtService = loan.monthsElapsed < loan.ioMonths ? interest : loan.payment;
  const principalPaid = Math.max(Math.min(debtService - interest, loan.balance), 0);

  loan.balance = Math.max(loan.balance - principalPaid, 0);
  loan.monthsElapsed += 1;

  return {
    interest,
    principalPaid,
    debtService,
    endingBalance: loan.balance,
    kind: loan.kind,
    name: loan.name
  };
}

function addAcquisitionSummary(inputs) {
  const acquisitionFee = inputs.purchasePrice * (inputs.acquisitionFeePct / 100);
  const earnestMoney = inputs.purchasePrice * (inputs.emdPct / 100);
  const totalUses =
    inputs.purchasePrice +
    inputs.closingCosts +
    acquisitionFee +
    inputs.repairEscrows +
    inputs.operatingReserves;
  const totalDebt = inputs.loanAmount + inputs.sellerCarryAmount;
  const totalEquityRequired = Math.max(totalUses - totalDebt, 0);
  const memberCapitalRequired = Math.max(totalEquityRequired - inputs.gpEquityContribution, 0);

  return {
    acquisitionFee,
    earnestMoney,
    totalUses,
    totalDebt,
    totalEquityRequired,
    memberCapitalRequired
  };
}

function buildQuarterlyCashFlows(returnsRows, initialMemberCapital) {
  const rows = [
    {
      year: 0,
      quarter: "Q0",
      month: 0,
      cashFlow: -initialMemberCapital
    }
  ];

  returnsRows.forEach((row) => {
    const quarterDistribution = row.memberCashFlow / QUARTERS_IN_YEAR;

    for (let quarter = 1; quarter <= QUARTERS_IN_YEAR; quarter += 1) {
      const isFourthQuarter = quarter === QUARTERS_IN_YEAR;
      rows.push({
        year: row.year,
        quarter: `Q${quarter}`,
        month: (row.year - 1) * MONTHS_IN_YEAR + quarter * 3,
        cashFlow:
          quarterDistribution +
          (isFourthQuarter ? row.capitalEventProceeds : 0)
      });
    }
  });

  return rows;
}

function summarizeLoanTables(yearlyLoanHistory, holdYears) {
  const grouped = {};

  yearlyLoanHistory.forEach((entry) => {
    if (!grouped[entry.kind]) {
      grouped[entry.kind] = {
        title: entry.name,
        rows: Array.from({ length: holdYears }, (_, index) => ({
          year: index + 1,
          principalPaid: 0,
          interestPaid: 0,
          debtService: 0,
          endingBalance: 0
        }))
      };
    }

    const bucket = grouped[entry.kind].rows[entry.year - 1];
    bucket.principalPaid += entry.principalPaid;
    bucket.interestPaid += entry.interest;
    bucket.debtService += entry.debtService;
    bucket.endingBalance = entry.endingBalance;
  });

  return Object.values(grouped);
}

function scoreReadiness(metric, actual, minimum) {
  return {
    metric,
    minimum,
    actual,
    passes: actual >= minimum
  };
}

function buildExpenseLines(inputs, effectiveGrossIncome, growthFactor) {
  const fixedExpenses = [
    ["Advertising", inputs.advertising],
    ["Contract Services", inputs.contractServices],
    ["Gas & Electric", inputs.gasElectric],
    ["General/Admin", inputs.generalAdmin],
    ["Insurance", inputs.insurance],
    ["Legal", inputs.legal],
    ["Real Estate Taxes", inputs.propertyTaxes],
    ["Trash Removal", inputs.trashRemoval],
    ["Payroll", inputs.payroll],
    ["Repairs & Maintenance", inputs.repairsMaintenance],
    ["Turnover", inputs.turnover],
    ["Water & Sewer", inputs.waterSewer]
  ].map(([label, baseValue]) => ({
    label,
    value: baseValue * growthFactor
  }));

  const managementFee = {
    label: "Management Fee",
    value: effectiveGrossIncome * (inputs.managementFee / 100)
  };

  const replacementReserve = {
    label: "Replacement Reserve",
    value: inputs.replacementReserve * inputs.unitCount
  };

  return [...fixedExpenses, managementFee, replacementReserve];
}

function runScenarioUnderwriting(inputs, scenario) {
  const acquisition = addAcquisitionSummary(inputs);
  const holdYears = inputs.holdYears;
  const effectiveVacancyPct = clamp(
    1 - inputs.economicOccupancy / 100 + scenario.vacancyDelta / 100,
    0,
    0.5
  );
  const effectiveConcessionsPct = clamp(
    (inputs.concessionsBadDebtPct + scenario.concessionsDelta) / 100,
    0,
    0.5
  );
  const effectiveRentGrowth = (inputs.rentGrowth + scenario.rentGrowthDelta) / 100;
  const effectiveExpenseGrowth = (inputs.expenseGrowth + scenario.expenseGrowthDelta) / 100;
  const memberSharePct = clamp(100 - inputs.gpPromoteShare, 0, 100) / 100;
  const managerSharePct = 1 - memberSharePct;
  const activeLoans = [];
  const yearlyLoanHistory = [];

  if (inputs.loanAmount > 0) {
    activeLoans.push(
      createLoan({
        name: "1st Mortgage",
        kind: "senior",
        principal: inputs.loanAmount,
        annualRatePct: inputs.interestRate,
        amortYears: inputs.amortYears,
        ioMonths: inputs.ioMonths
      })
    );
  }

  if (inputs.sellerCarryAmount > 0) {
    activeLoans.push(
      createLoan({
        name: "2nd Mortgage / Seller Carry",
        kind: "seller",
        principal: inputs.sellerCarryAmount,
        annualRatePct: inputs.sellerCarryRate,
        amortYears: inputs.sellerCarryAmortYears,
        ioMonths: 0
      })
    );
  }

  let avgMonthlyRent = inputs.avgRent;
  let annualOtherIncome = inputs.otherIncomePerUnit * inputs.unitCount * MONTHS_IN_YEAR;
  let beginningMemberCapital = acquisition.memberCapitalRequired;
  let memberPrefDeficiency = 0;
  let cumulativePrincipalReduction = 0;
  let initialSeniorDebt = inputs.loanAmount + inputs.sellerCarryAmount;
  let refiSummary = null;

  const annualRows = [];
  const returnsRows = [];

  for (let year = 1; year <= holdYears; year += 1) {
    if (year > 1) {
      avgMonthlyRent *= 1 + effectiveRentGrowth;
      annualOtherIncome *= 1 + effectiveRentGrowth;
    }

    const grossScheduleRent = avgMonthlyRent * inputs.unitCount * MONTHS_IN_YEAR;
    const vacancy = -grossScheduleRent * effectiveVacancyPct;
    const concessionsBadDebt = -grossScheduleRent * effectiveConcessionsPct;
    const grossPotentialIncome = grossScheduleRent + vacancy + concessionsBadDebt;
    const otherIncome = annualOtherIncome + scenario.otherIncomeDelta * inputs.unitCount * MONTHS_IN_YEAR;
    const effectiveGrossIncome = grossPotentialIncome + otherIncome;
    const expenseGrowthFactor = Math.pow(1 + effectiveExpenseGrowth, year - 1);
    const expenseLines = buildExpenseLines(inputs, effectiveGrossIncome, expenseGrowthFactor);
    const totalExpenses = expenseLines.reduce((sum, line) => sum + line.value, 0);
    const replacementReserveAnnual = inputs.replacementReserve * inputs.unitCount;
    const noi = effectiveGrossIncome - totalExpenses;

    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    let yearlyDebtService = 0;

    activeLoans.forEach((loan) => {
      let loanYearlyPrincipal = 0;
      let loanYearlyInterest = 0;
      let loanYearlyDebtService = 0;

      for (let month = 0; month < MONTHS_IN_YEAR; month += 1) {
        const entry = advanceLoanMonth(loan);
        loanYearlyPrincipal += entry.principalPaid;
        loanYearlyInterest += entry.interest;
        loanYearlyDebtService += entry.debtService;
        yearlyPrincipal += entry.principalPaid;
        yearlyInterest += entry.interest;
        yearlyDebtService += entry.debtService;
      }

      yearlyLoanHistory.push({
        year,
        kind: loan.kind,
        name: loan.name,
        principalPaid: loanYearlyPrincipal,
        interest: loanYearlyInterest,
        debtService: loanYearlyDebtService,
        endingBalance: loan.balance
      });
    });

    cumulativePrincipalReduction += yearlyPrincipal;

    const cashFlowAvailable = noi - yearlyDebtService;
    const assetManagementFee = Math.max(
      Math.min(effectiveGrossIncome * (inputs.assetManagementFeePct / 100), Math.max(cashFlowAvailable, 0)),
      0
    );
    const preferredReturnDue =
      beginningMemberCapital * (inputs.lpPrefRate / 100) + memberPrefDeficiency;
    const preferredReturnPaid = Math.max(
      Math.min(Math.max(cashFlowAvailable - assetManagementFee, 0), preferredReturnDue),
      0
    );
    memberPrefDeficiency = Math.max(preferredReturnDue - preferredReturnPaid, 0);

    const distributableCash = Math.max(
      cashFlowAvailable - assetManagementFee - preferredReturnPaid,
      0
    );
    const memberCashFlow = preferredReturnPaid + distributableCash * memberSharePct;
    const managerCashFlow = assetManagementFee + distributableCash * managerSharePct;

    annualRows.push({
      year,
      avgMonthlyRent,
      grossScheduleRent,
      vacancy,
      concessionsBadDebt,
      otherIncome,
      totalIncome: effectiveGrossIncome,
      expenseLines,
      totalExpenses,
      noi,
      principalPaid: yearlyPrincipal,
      interestPaid: yearlyInterest,
      debtService: yearlyDebtService,
      cashFlowAvailable,
      assetManagementFee,
      preferredReturnDue,
      preferredReturnPaid,
      preferredReturnDeficiency: memberPrefDeficiency,
      memberCashFlow,
      managerCashFlow,
      memberCapitalBeginning: beginningMemberCapital,
      memberCapitalEnding: beginningMemberCapital,
      capitalEventProceeds: 0
    });

    returnsRows.push({
      year,
      memberCapitalBeginning: beginningMemberCapital,
      memberCashFlow,
      cashOnCash: safeDivide(memberCashFlow, beginningMemberCapital || acquisition.memberCapitalRequired),
      avgCashOnCash: 0,
      averageAnnualReturnToDate: 0,
      capitalEventProceeds: 0,
      memberCapitalReturned: 0,
      memberEndingCapital: beginningMemberCapital
    });

    if (inputs.refiYear > 0 && year === inputs.refiYear) {
      const refiNoi = noi + replacementReserveAnnual;
      const appraisedValue = safeDivide(refiNoi, inputs.refiCapRate / 100);
      const newLoanAmount = appraisedValue * (inputs.refiLtv / 100);
      const outstandingBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
      const refiCosts = appraisedValue * (inputs.refiClosingCostPct / 100);
      const prepayPenalty = outstandingBalance * (inputs.prepayPenaltyPct / 100);
      const grossRefiProceeds = Math.max(
        newLoanAmount - refiCosts - prepayPenalty - outstandingBalance,
        0
      );

      const memberCapitalReturned = Math.min(grossRefiProceeds, beginningMemberCapital);
      const endingMemberCapital = Math.max(beginningMemberCapital - memberCapitalReturned, 0);
      const netProfitFromRefi =
        endingMemberCapital > 0 ? 0 : Math.max(grossRefiProceeds - memberCapitalReturned, 0);
      const appreciation = Math.max(netProfitFromRefi - cumulativePrincipalReduction, 0);
      const capitalTransactionFee = endingMemberCapital === 0
        ? Math.min(appraisedValue * (inputs.capitalTransactionFeePct / 100), netProfitFromRefi)
        : 0;
      const memberProfitShare = Math.max(netProfitFromRefi - capitalTransactionFee, 0) * memberSharePct;
      const managerProfitShare =
        capitalTransactionFee + Math.max(netProfitFromRefi - capitalTransactionFee, 0) * managerSharePct;
      const totalCashToMembers = memberCapitalReturned + memberProfitShare;

      const yearRow = annualRows[year - 1];
      yearRow.capitalEventProceeds = totalCashToMembers;
      yearRow.memberCapitalEnding = endingMemberCapital;

      const returnRow = returnsRows[year - 1];
      returnRow.capitalEventProceeds = totalCashToMembers;
      returnRow.memberCapitalReturned = memberCapitalReturned;
      returnRow.memberEndingCapital = endingMemberCapital;

      refiSummary = {
        year,
        refiNoi,
        appraisedValue,
        newLoanAmount,
        refiCosts,
        prepayPenalty,
        outstandingBalance,
        grossRefiProceeds,
        memberCapitalReturned,
        endingMemberCapital,
        appreciation,
        capitalTransactionFee,
        memberProfitShare,
        managerProfitShare,
        totalCashToMembers
      };

      beginningMemberCapital = endingMemberCapital;
      activeLoans.length = 0;
      activeLoans.push(
        createLoan({
          name: "1st Mortgage Re-Fi",
          kind: "refi",
          principal: newLoanAmount,
          annualRatePct: inputs.refiRate,
          amortYears: inputs.refiAmortYears,
          ioMonths: inputs.refiIoMonths
        })
      );
      initialSeniorDebt = newLoanAmount;
    }
  }

  const finalYear = annualRows[annualRows.length - 1];
  const endingLoanBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
  const saleNoi = finalYear.noi + inputs.replacementReserve * inputs.unitCount;
  const salePrice = safeDivide(saleNoi, inputs.exitCapRate / 100);
  const saleCosts = salePrice * (inputs.saleCostsPct / 100);
  const totalEquityAtSale =
    inputs.operatingReserves + salePrice - saleCosts - endingLoanBalance;
  const memberCapitalReturnedAtSale = Math.min(beginningMemberCapital, totalEquityAtSale);
  const memberPrefPaidAtSale = Math.min(
    Math.max(totalEquityAtSale - memberCapitalReturnedAtSale, 0),
    memberPrefDeficiency
  );
  const netSaleProfit = Math.max(
    totalEquityAtSale - memberCapitalReturnedAtSale - memberPrefPaidAtSale,
    0
  );
  const capitalTransactionFeeAtSale = Math.min(
    salePrice * (inputs.capitalTransactionFeePct / 100),
    netSaleProfit
  );
  const memberProfitShareAtSale =
    Math.max(netSaleProfit - capitalTransactionFeeAtSale, 0) * memberSharePct;
  const managerProfitShareAtSale =
    capitalTransactionFeeAtSale + Math.max(netSaleProfit - capitalTransactionFeeAtSale, 0) * managerSharePct;
  const totalCashToMembersAtSale =
    memberCapitalReturnedAtSale + memberPrefPaidAtSale + memberProfitShareAtSale;

  finalYear.capitalEventProceeds += totalCashToMembersAtSale;
  finalYear.memberCapitalEnding = 0;

  const finalReturnRow = returnsRows[returnsRows.length - 1];
  finalReturnRow.capitalEventProceeds += totalCashToMembersAtSale;
  finalReturnRow.memberCapitalReturned += memberCapitalReturnedAtSale;
  finalReturnRow.memberEndingCapital = 0;

  const avgCashOnCashValues = [];
  let cumulativeReturn = 0;

  returnsRows.forEach((row, index) => {
    const denominator = row.memberCapitalBeginning || acquisition.memberCapitalRequired;
    row.cashOnCash = safeDivide(row.memberCashFlow, denominator);
    if (row.cashOnCash > 0) {
      avgCashOnCashValues.push(row.cashOnCash);
    }

    cumulativeReturn += row.memberCashFlow + row.capitalEventProceeds;
    row.avgCashOnCash =
      avgCashOnCashValues.reduce((sum, value) => sum + value, 0) /
      Math.max(avgCashOnCashValues.length, 1);
    row.averageAnnualReturnToDate = safeDivide(
      cumulativeReturn,
      acquisition.memberCapitalRequired * (index + 1)
    );
  });

  const quarterlyCashFlows = buildQuarterlyCashFlows(
    returnsRows.map((row) => ({
      year: row.year,
      memberCashFlow: row.memberCashFlow,
      capitalEventProceeds: row.capitalEventProceeds
    })),
    acquisition.memberCapitalRequired
  );
  const irrCashFlows = quarterlyCashFlows.map((row) => row.cashFlow);
  const monthlyEquivalentIrr = estimateIrr(
    irrCashFlows.flatMap((value, index) => (index === 0 ? [value] : [0, 0, value]))
  );
  const annualizedIrr = Number.isNaN(monthlyEquivalentIrr)
    ? Number.NaN
    : annualizeMonthlyRate(monthlyEquivalentIrr);
  const averageAnnualReturn = inputs.refiYear > 0
    ? annualizedIrr
    : returnsRows[returnsRows.length - 1].averageAnnualReturnToDate;
  const avgCashOnCash =
    avgCashOnCashValues.reduce((sum, value) => sum + value, 0) /
    Math.max(avgCashOnCashValues.length, 1);
  const yearOne = annualRows[0];

  const readiness = [
    scoreReadiness("Debt Coverage Ratio", safeDivide(yearOne.noi, yearOne.debtService), 1.25),
    scoreReadiness("Annualized Return", averageAnnualReturn, 0.15),
    scoreReadiness("IRR", annualizedIrr, 0.14),
    scoreReadiness("Expense Ratio", safeDivide(yearOne.totalExpenses, yearOne.totalIncome), 0.5),
    scoreReadiness(
      "Return of Capital via Refi",
      refiSummary ? safeDivide(refiSummary.memberCapitalReturned, acquisition.memberCapitalRequired) : 0,
      0.6
    ),
    scoreReadiness("Average Cash on Cash", avgCashOnCash, 0.07),
    scoreReadiness("Replacement Reserve / Unit / Year", inputs.replacementReserve, 250)
  ];

  return {
    initialEquity: acquisition.totalEquityRequired,
    initialMemberCapital: acquisition.memberCapitalRequired,
    annualizedReturn: averageAnnualReturn,
    annualizedIrr,
    cashOnCash: returnsRows[0]?.cashOnCash ?? 0,
    avgCashOnCash,
    equityMultiple: safeDivide(
      returnsRows.reduce((sum, row) => sum + row.memberCashFlow + row.capitalEventProceeds, 0),
      acquisition.memberCapitalRequired
    ),
    dscr: safeDivide(yearOne.noi, yearOne.debtService),
    breakEvenRatio: safeDivide(yearOne.totalExpenses + yearOne.debtService, yearOne.totalIncome),
    debtYield: safeDivide(yearOne.noi, inputs.loanAmount + inputs.sellerCarryAmount),
    baselineCapRate: safeDivide(yearOne.noi, inputs.purchasePrice),
    acquisition,
    annualRows,
    returnsRows,
    quarterlyCashFlows,
    readiness,
    loanTables: summarizeLoanTables(yearlyLoanHistory, holdYears),
    refiDistributionSummary: refiSummary,
    exit: {
      refinanceYear: inputs.refiYear,
      refiSummary,
      sale: {
        saleNoi,
        salePrice,
        saleCosts,
        endingLoanBalance,
        totalEquityAtSale,
        memberCapitalReturnedAtSale,
        memberPrefPaidAtSale,
        capitalTransactionFeeAtSale,
        memberProfitShareAtSale,
        managerProfitShareAtSale,
        totalCashToMembersAtSale
      }
    },
    summary: {
      askingPrice: inputs.askingPrice,
      purchasePrice: inputs.purchasePrice,
      pricePerUnit: safeDivide(inputs.purchasePrice, inputs.unitCount),
      earnestMoney: acquisition.earnestMoney,
      downPayment: Math.max(inputs.purchasePrice - inputs.loanAmount - inputs.sellerCarryAmount, 0),
      firstMortgage: inputs.loanAmount,
      secondMortgage: inputs.sellerCarryAmount,
      interestRate: inputs.interestRate / 100,
      yearOneNoi: yearOne.noi,
      yearOneDebtService: yearOne.debtService
    },
    quickAnalysis: {
      grossPotentialAnnualIncome: yearOne.grossScheduleRent,
      vacancyRate: effectiveVacancyPct,
      expenseRate: safeDivide(yearOne.totalExpenses, yearOne.totalIncome),
      valuation: safeDivide(yearOne.noi, inputs.exitCapRate / 100),
      marketCapRate: safeDivide(yearOne.noi, inputs.purchasePrice),
      maxAnnualDebtService: safeDivide(yearOne.noi, 1.25),
      maxLoanAmount: safeDivide(
        safeDivide(yearOne.noi, 1.25),
        safeDivide(paymentForLoan(inputs.loanAmount || 1, inputs.interestRate, inputs.amortYears) * 12, inputs.loanAmount || 1)
      )
    },
    loiAnalysis: {
      askingPrice: inputs.askingPrice,
      purchasePrice: inputs.purchasePrice,
      noi: yearOne.noi,
      interestRate: inputs.interestRate / 100,
      maximumAnnualLoanPayment: safeDivide(yearOne.noi, 1.25),
      maxLoanAmount: safeDivide(
        safeDivide(yearOne.noi, 1.25),
        safeDivide(paymentForLoan(inputs.loanAmount || 1, inputs.interestRate, inputs.amortYears) * 12, inputs.loanAmount || 1)
      ),
      downPayment: Math.max(
        inputs.purchasePrice -
          safeDivide(
            safeDivide(yearOne.noi, 1.25),
            safeDivide(paymentForLoan(inputs.loanAmount || 1, inputs.interestRate, inputs.amortYears) * 12, inputs.loanAmount || 1)
          ),
        0
      ),
      downPaymentPct: safeDivide(
        Math.max(
          inputs.purchasePrice -
            safeDivide(
              safeDivide(yearOne.noi, 1.25),
              safeDivide(paymentForLoan(inputs.loanAmount || 1, inputs.interestRate, inputs.amortYears) * 12, inputs.loanAmount || 1)
            ),
          0
        ),
        inputs.purchasePrice
      )
    }
  };
}

window.runScenarioUnderwriting = runScenarioUnderwriting;
