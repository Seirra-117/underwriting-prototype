const acquisitionMethods = [
  "Traditional Purchase",
  "Syndication",
  "Subject-To",
  "Seller Finance",
  "Joint Venture",
  "Assumable Loan",
  "Cash Purchase",
  "Multiple"
];

const workbookTabs = [
  "About",
  "RR Sort",
  "T-12 Sort",
  "Rent Targets",
  "Other Income",
  "CapEx Budget",
  "Property Tax",
  "Insurance",
  "Lender Terms",
  "Scenarios",
  "Summary",
  "P&L",
  "Acquisition Costs",
  "Exit Strategy",
  "Returns",
  "IRR",
  "Loans",
  "1st Mortgage 1",
  "2nd Mortgage 1",
  "1st Mortgage Re-Fi",
  "2-Minute Analysis",
  "MinMax LOI Analysis",
  "Variables"
];

const presets = {
  balanced: {
    economicOccupancy: 93,
    leaseUpPerMonth: 3,
    renoUnitsPerMonth: 2,
    rentGrowth: 3,
    expenseGrowth: 3.5,
    renoPremium: 125,
    concessionsBadDebtPct: 5
  },
  conservative: {
    economicOccupancy: 90,
    leaseUpPerMonth: 2,
    renoUnitsPerMonth: 1,
    rentGrowth: 2,
    expenseGrowth: 4,
    renoPremium: 80,
    concessionsBadDebtPct: 6
  },
  aggressive: {
    economicOccupancy: 95,
    leaseUpPerMonth: 4,
    renoUnitsPerMonth: 3,
    rentGrowth: 4,
    expenseGrowth: 3,
    renoPremium: 175,
    concessionsBadDebtPct: 4
  }
};

const state = {
  activeTab: "dashboard",
  activeScenarioId: "base",
  projectName: "Veranda Village",
  dealStatus: "screening",
  marketName: "Phoenix, AZ",
  askingPrice: 17810000,
  purchasePrice: 13000000,
  unitCount: 274,
  emdPct: 1,
  assumptionPreset: "balanced",
  targetArr: 15,
  targetIrr: 14,
  targetCoc: 7,
  avgRent: 1026.707419,
  marketRent: 1180,
  otherIncomePerUnit: 26.671731,
  economicOccupancy: 90,
  concessionsBadDebtPct: 5,
  leaseUpPerMonth: 4,
  renoUnitsPerMonth: 5,
  renoPremium: 125,
  rentGrowth: 6.5,
  expenseGrowth: 3,
  advertising: 27400,
  contractServices: 82200,
  gasElectric: 216863.11,
  generalAdmin: 53978,
  insurance: 287700,
  legal: 0,
  propertyTaxes: 314772.77,
  trashRemoval: 0,
  managementFee: 2,
  payroll: 411000,
  repairsMaintenance: 191800,
  turnover: 0,
  waterSewer: 264901.37,
  replacementReserve: 250,
  assetManagementFeePct: 4,
  closingCosts: 286532,
  acquisitionFeePct: 2,
  repairEscrows: 1050000,
  operatingReserves: 137000,
  loanAmount: 11567500,
  interestRate: 5,
  amortYears: 30,
  ioMonths: 0,
  sellerCarryAmount: 0,
  sellerCarryRate: 5,
  sellerCarryAmortYears: 20,
  holdYears: 10,
  exitCapRate: 7.5,
  saleCostsPct: 3,
  refiYear: 4,
  refiRate: 4,
  refiLtv: 71.2,
  refiCapRate: 6.9,
  refiClosingCostPct: 2,
  refiAmortYears: 30,
  refiIoMonths: 0,
  prepayPenaltyPct: 0,
  capitalTransactionFeePct: 2,
  acquisitionMethod: "Multiple",
  primaryMethod: "Syndication",
  selectedMethods: ["Syndication", "Assumable Loan", "Seller Finance"],
  waterfallMode: "pref-and-promote",
  lpPrefRate: 0,
  gpPromoteShare: 50,
  gpEquityContribution: 0,
  gpMembers: [
    { name: "Sponsor Manager", ownershipPct: 60, contribution: 0 },
    { name: "Operating Partner", ownershipPct: 40, contribution: 0 }
  ],
  lpClasses: [
    { label: "$5K Class", classCount: 20, commitment: 5000 },
    { label: "$50K Class", classCount: 12, commitment: 50000 },
    { label: "$100K Class", classCount: 16, commitment: 100000 },
    { label: "$500K Class", classCount: 6, commitment: 500000 }
  ],
  documents: [],
  scenarios: [
    {
      id: "base",
      name: "Marketing Package",
      vacancyDelta: 0,
      rentGrowthDelta: 0,
      expenseGrowthDelta: 0,
      renoPremiumDelta: 0,
      otherIncomeDelta: 0,
      concessionsDelta: 0,
      leaseUpPerMonth: 4,
      renoUnitsPerMonth: 5,
      exitCapDelta: 0
    },
    {
      id: "my-version",
      name: "My Version",
      vacancyDelta: 1,
      rentGrowthDelta: -0.5,
      expenseGrowthDelta: 0.5,
      renoPremiumDelta: 25,
      otherIncomeDelta: 5,
      concessionsDelta: 1,
      leaseUpPerMonth: 3,
      renoUnitsPerMonth: 4,
      exitCapDelta: 0.15
    },
    {
      id: "upside",
      name: "Upside",
      vacancyDelta: -1,
      rentGrowthDelta: 0.75,
      expenseGrowthDelta: -0.25,
      renoPremiumDelta: 40,
      otherIncomeDelta: 8,
      concessionsDelta: -1,
      leaseUpPerMonth: 5,
      renoUnitsPerMonth: 6,
      exitCapDelta: -0.2
    },
    {
      id: "stress",
      name: "Stress",
      vacancyDelta: 3,
      rentGrowthDelta: -1,
      expenseGrowthDelta: 1,
      renoPremiumDelta: -35,
      otherIncomeDelta: -5,
      concessionsDelta: 2,
      leaseUpPerMonth: 2,
      renoUnitsPerMonth: 2,
      exitCapDelta: 0.35
    }
  ]
};

const numericFieldIds = [
  "askingPrice",
  "purchasePrice",
  "unitCount",
  "emdPct",
  "targetArr",
  "targetIrr",
  "targetCoc",
  "avgRent",
  "marketRent",
  "otherIncomePerUnit",
  "economicOccupancy",
  "concessionsBadDebtPct",
  "leaseUpPerMonth",
  "renoUnitsPerMonth",
  "renoPremium",
  "rentGrowth",
  "expenseGrowth",
  "advertising",
  "contractServices",
  "gasElectric",
  "generalAdmin",
  "propertyTaxes",
  "insurance",
  "legal",
  "trashRemoval",
  "payroll",
  "repairsMaintenance",
  "turnover",
  "waterSewer",
  "managementFee",
  "replacementReserve",
  "assetManagementFeePct",
  "closingCosts",
  "acquisitionFeePct",
  "repairEscrows",
  "operatingReserves",
  "loanAmount",
  "interestRate",
  "amortYears",
  "ioMonths",
  "sellerCarryAmount",
  "sellerCarryRate",
  "sellerCarryAmortYears",
  "holdYears",
  "exitCapRate",
  "saleCostsPct",
  "refiYear",
  "refiRate",
  "refiLtv",
  "refiCapRate",
  "refiClosingCostPct",
  "refiAmortYears",
  "refiIoMonths",
  "prepayPenaltyPct",
  "capitalTransactionFeePct",
  "lpPrefRate",
  "gpPromoteShare",
  "gpEquityContribution"
];

const elements = {
  tabStrip: document.querySelector("#tabStrip"),
  activeScenarioSelect: document.querySelector("#activeScenarioSelect"),
  assumptionPreset: document.querySelector("#assumptionPreset"),
  acquisitionMethod: document.querySelector("#acquisitionMethod"),
  primaryMethod: document.querySelector("#primaryMethod"),
  documentUpload: document.querySelector("#documentUpload"),
  documentList: document.querySelector("#documentList"),
  docsViewDocumentList: document.querySelector("#docsViewDocumentList"),
  layeredMethods: document.querySelector("#layeredMethods"),
  gpTable: document.querySelector("#gpTable"),
  lpTable: document.querySelector("#lpTable"),
  scenarioGrid: document.querySelector("#scenarioGrid"),
  comparisonTable: document.querySelector("#comparisonTable"),
  readinessDashboard: document.querySelector("#readinessDashboard"),
  templateAlignment: document.querySelector("#templateAlignment"),
  reviewerNotes: document.querySelector("#reviewerNotes"),
  summaryMetrics: document.querySelector("#summaryMetrics"),
  summaryTable: document.querySelector("#summaryTable"),
  pnlTable: document.querySelector("#pnlTable"),
  acquisitionSummary: document.querySelector("#acquisitionSummary"),
  exitSummary: document.querySelector("#exitSummary"),
  returnsTable: document.querySelector("#returnsTable"),
  irrTable: document.querySelector("#irrTable"),
  loanTables: document.querySelector("#loanTables"),
  quickAnalysis: document.querySelector("#quickAnalysis"),
  loiAnalysis: document.querySelector("#loiAnalysis"),
  templateMapping: document.querySelector("#templateMapping"),
  recalculateButton: document.querySelector("#recalculateButton")
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

function formatPercent(value) {
  return `${((value ?? 0) * 100).toFixed(1)}%`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value ?? 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderDataTable(columns, rows) {
  const head = columns.map((column) => `<th>${column}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )
    .join("");

  return `<table class="data-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function makeOption(select, value, label = value) {
  if ([...select.options].some((option) => option.value === value)) {
    return;
  }

  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function seedSelects() {
  Object.keys(presets).forEach((presetKey) => {
    makeOption(
      elements.assumptionPreset,
      presetKey,
      `${presetKey.charAt(0).toUpperCase()}${presetKey.slice(1)} preset`
    );
  });

  acquisitionMethods.forEach((method) => {
    makeOption(elements.acquisitionMethod, method);
    if (method !== "Multiple") {
      makeOption(elements.primaryMethod, method);
    }
  });

  state.scenarios.forEach((scenario) => {
    makeOption(elements.activeScenarioSelect, scenario.id, scenario.name);
  });
}

function syncInputsFromState() {
  ["projectName", "dealStatus", "marketName", "waterfallMode"].forEach((id) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = state[id];
  });

  numericFieldIds.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = state[id];
  });

  elements.assumptionPreset.value = state.assumptionPreset;
  elements.acquisitionMethod.value = state.acquisitionMethod;
  elements.primaryMethod.value = state.primaryMethod;
  elements.activeScenarioSelect.value = state.activeScenarioId;
}

function bindInputs() {
  ["projectName", "dealStatus", "marketName", "waterfallMode"].forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.addEventListener("input", () => {
      state[id] = input.value;
      rerender();
    });
  });

  numericFieldIds.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.addEventListener("input", () => {
      state[id] = Number(input.value);
      rerender();
    });
  });

  elements.assumptionPreset.addEventListener("change", () => {
    state.assumptionPreset = elements.assumptionPreset.value;
    Object.assign(state, presets[state.assumptionPreset]);
    syncInputsFromState();
    rerender();
  });

  elements.acquisitionMethod.addEventListener("change", () => {
    state.acquisitionMethod = elements.acquisitionMethod.value;
    if (state.acquisitionMethod !== "Multiple") {
      state.selectedMethods = [state.acquisitionMethod];
      state.primaryMethod = state.acquisitionMethod;
    }
    rerender();
  });

  elements.primaryMethod.addEventListener("change", () => {
    state.primaryMethod = elements.primaryMethod.value;
    rerender();
  });

  elements.activeScenarioSelect.addEventListener("change", () => {
    state.activeScenarioId = elements.activeScenarioSelect.value;
    rerender();
  });

  elements.recalculateButton.addEventListener("click", rerender);
}

function bindTabs() {
  elements.tabStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    state.activeTab = button.dataset.tab;
    rerenderTabs();
  });
}

function rerenderTabs() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === state.activeTab);
  });

  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === state.activeTab);
  });
}

function detectDocumentType(fileName) {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes("rent")) return "Rent Roll";
  if (lowerName.includes("t12") || lowerName.includes("trailing")) return "T-12";
  if (lowerName.includes("tax")) return "Tax Document";
  if (lowerName.includes("term")) return "Loan Term Sheet";
  if (lowerName.includes("title")) return "Title Summary";
  if (lowerName.includes("survey")) return "Survey Summary";
  return "General Deal File";
}

// OCR and AI extraction are deferred, so these draft extractions mimic the review
// workflow while remaining deterministic and inexpensive for the MVP.
function generateDraftExtraction(type) {
  const templates = {
    "Rent Roll": [
      { label: "Average in-place rent", value: formatCurrency(state.avgRent), confidence: 0.91 },
      { label: "Economic occupancy", value: `${state.economicOccupancy}%`, confidence: 0.83 }
    ],
    "T-12": [
      { label: "Annual repairs", value: formatCurrency(state.repairsMaintenance), confidence: 0.88 },
      { label: "Annual payroll", value: formatCurrency(state.payroll), confidence: 0.79 }
    ],
    "Tax Document": [
      { label: "Annual property taxes", value: formatCurrency(state.propertyTaxes), confidence: 0.95 }
    ],
    "Loan Term Sheet": [
      { label: "Interest rate", value: `${state.interestRate}%`, confidence: 0.86 },
      { label: "Loan amount", value: formatCurrency(state.loanAmount), confidence: 0.88 }
    ]
  };

  return templates[type] ?? [
    { label: "Manual review required", value: "Awaiting mapping", confidence: 0.42 }
  ];
}

function bindDocumentUpload() {
  elements.documentUpload.addEventListener("change", (event) => {
    const files = Array.from(event.target.files ?? []);

    state.documents = files.map((file) => {
      const detectedType = detectDocumentType(file.name);
      return {
        name: file.name,
        size: file.size,
        type: detectedType,
        extractionItems: generateDraftExtraction(detectedType)
      };
    });

    rerender();
  });
}

function renderDocuments(targetElement) {
  targetElement.innerHTML = "";

  if (state.documents.length === 0) {
    targetElement.innerHTML =
      '<p class="section-note">No files uploaded yet. Upload docs to see low-confidence fields flagged for review.</p>';
    return;
  }

  state.documents.forEach((doc) => {
    const confidence = Math.min(...doc.extractionItems.map((entry) => entry.confidence));
    const item = document.createElement("article");
    item.className = "document-item";
    item.innerHTML = `
      <div><strong>${escapeHtml(doc.name)}</strong><br /><span>${escapeHtml(doc.type)}</span></div>
      <div class="${confidence >= 0.85 ? "confidence-high" : "confidence-low"}">${Math.round(confidence * 100)}% min confidence</div>
      <div>${doc.extractionItems.map((entry) => `<div><strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}</div>`).join("")}</div>
    `;
    targetElement.append(item);
  });
}

function renderLayeredMethods() {
  elements.layeredMethods.innerHTML = "";

  if (state.acquisitionMethod !== "Multiple") {
    elements.layeredMethods.innerHTML = `<p class="section-note">Using a single acquisition method: ${escapeHtml(state.acquisitionMethod)}.</p>`;
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "pill-list";

  acquisitionMethods
    .filter((method) => method !== "Multiple")
    .forEach((method) => {
      const label = document.createElement("label");
      label.className = "layer-pill";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state.selectedMethods.includes(method);
      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        if (isChecked && state.selectedMethods.length >= 3) {
          checkbox.checked = false;
          return;
        }

        state.selectedMethods = isChecked
          ? [...state.selectedMethods, method]
          : state.selectedMethods.filter((selected) => selected !== method);

        if (!state.selectedMethods.includes(state.primaryMethod)) {
          state.primaryMethod = state.selectedMethods[0] ?? "Syndication";
        }

        syncInputsFromState();
        rerender();
      });

      label.append(checkbox, document.createTextNode(method));
      wrap.append(label);
    });

  elements.layeredMethods.append(wrap);
}

function renderMemberTables() {
  elements.gpTable.innerHTML = "";
  state.gpMembers.forEach((member, index) => {
    const row = document.createElement("div");
    row.className = "member-row";
    row.innerHTML = `
      <label>Member<input data-group="gp" data-index="${index}" data-key="name" type="text" value="${escapeHtml(member.name)}" /></label>
      <label>Ownership %<input data-group="gp" data-index="${index}" data-key="ownershipPct" type="number" value="${member.ownershipPct}" /></label>
      <label>Contribution<input data-group="gp" data-index="${index}" data-key="contribution" type="number" value="${member.contribution}" /></label>
    `;
    elements.gpTable.append(row);
  });

  elements.lpTable.innerHTML = "";
  state.lpClasses.forEach((lpClass, index) => {
    const row = document.createElement("div");
    row.className = "member-row";
    row.innerHTML = `
      <label>Class<input data-group="lp" data-index="${index}" data-key="label" type="text" value="${escapeHtml(lpClass.label)}" /></label>
      <label>Investors<input data-group="lp" data-index="${index}" data-key="classCount" type="number" value="${lpClass.classCount}" /></label>
      <label>Commitment<input data-group="lp" data-index="${index}" data-key="commitment" type="number" value="${lpClass.commitment}" /></label>
    `;
    elements.lpTable.append(row);
  });

  document.querySelectorAll("[data-group]").forEach((input) => {
    input.addEventListener("input", () => {
      const { group, index, key } = input.dataset;
      const collection = group === "gp" ? state.gpMembers : state.lpClasses;
      collection[Number(index)][key] = input.type === "number" ? Number(input.value) : input.value;

      if (group === "gp") {
        state.gpEquityContribution = state.gpMembers.reduce(
          (sum, member) => sum + Number(member.contribution || 0),
          0
        );
        document.querySelector("#gpEquityContribution").value = state.gpEquityContribution;
      }

      rerender();
    });
  });
}

function getResultsSet() {
  return state.scenarios.map((scenario) => ({
    scenario,
    results: window.runScenarioUnderwriting(state, scenario)
  }));
}

function getActiveResult(resultsSet) {
  return resultsSet.find(({ scenario }) => scenario.id === state.activeScenarioId) ?? resultsSet[0];
}

function renderScenarioGrid(resultsSet) {
  elements.scenarioGrid.innerHTML = "";

  resultsSet.forEach(({ scenario, results }) => {
    const card = document.createElement("article");
    card.className = "scenario-card";
    card.innerHTML = `
      <div class="scenario-header">
        <div>
          <p class="section-kicker">Scenario</p>
          <h3>${escapeHtml(scenario.name)}</h3>
        </div>
        <div>
          <strong>${formatPercent(results.baselineCapRate)}</strong>
          <p class="section-note">Year 1 cap rate</p>
        </div>
      </div>
      <div class="form-grid four-up compact">
        <label>Vacancy delta (percentage points)<input data-scenario="${scenario.id}" data-key="vacancyDelta" type="number" step="0.1" value="${scenario.vacancyDelta}" /></label>
        <label>Rent growth delta (% / year)<input data-scenario="${scenario.id}" data-key="rentGrowthDelta" type="number" step="0.1" value="${scenario.rentGrowthDelta}" /></label>
        <label>Expense growth delta (% / year)<input data-scenario="${scenario.id}" data-key="expenseGrowthDelta" type="number" step="0.1" value="${scenario.expenseGrowthDelta}" /></label>
        <label>Concessions delta (percentage points)<input data-scenario="${scenario.id}" data-key="concessionsDelta" type="number" step="0.1" value="${scenario.concessionsDelta}" /></label>
        <label>Reno premium delta ($ / unit / month)<input data-scenario="${scenario.id}" data-key="renoPremiumDelta" type="number" step="1" value="${scenario.renoPremiumDelta}" /></label>
        <label>Other income delta ($ / unit / month)<input data-scenario="${scenario.id}" data-key="otherIncomeDelta" type="number" step="1" value="${scenario.otherIncomeDelta}" /></label>
        <label>Lease-up pace (units / month)<input data-scenario="${scenario.id}" data-key="leaseUpPerMonth" type="number" step="1" value="${scenario.leaseUpPerMonth}" /></label>
        <label>Reno units (units / month)<input data-scenario="${scenario.id}" data-key="renoUnitsPerMonth" type="number" step="1" value="${scenario.renoUnitsPerMonth}" /></label>
        <label>Exit cap delta (percentage points)<input data-scenario="${scenario.id}" data-key="exitCapDelta" type="number" step="0.05" value="${scenario.exitCapDelta}" /></label>
      </div>
      <div class="metric-grid">
        <div class="metric-chip"><span>Equity Multiple</span><strong>${results.equityMultiple.toFixed(2)}x</strong></div>
        <div class="metric-chip"><span>ARR</span><strong>${formatPercent(results.annualizedReturn)}</strong></div>
        <div class="metric-chip"><span>IRR</span><strong>${formatPercent(results.annualizedIrr)}</strong></div>
        <div class="metric-chip"><span>DSCR</span><strong>${formatNumber(results.dscr)}</strong></div>
        <div class="metric-chip"><span>Year 1 NOI</span><strong>${formatCurrency(results.annualRows[0]?.noi ?? 0)}</strong></div>
        <div class="metric-chip"><span>Refi return of capital</span><strong>${formatPercent((results.refiDistributionSummary?.memberCapitalReturned ?? 0) / Math.max(results.initialMemberCapital || 1, 1))}</strong></div>
      </div>
    `;
    elements.scenarioGrid.append(card);
  });

  document.querySelectorAll("[data-scenario]").forEach((input) => {
    input.addEventListener("input", () => {
      const scenario = state.scenarios.find((entry) => entry.id === input.dataset.scenario);
      scenario[input.dataset.key] = Number(input.value);
      rerender();
    });
  });
}

function renderComparisonTable(resultsSet) {
  const columns = ["Metric", ...resultsSet.map(({ scenario }) => scenario.name)];
  const rows = [
    ["Purchase price", ...resultsSet.map(() => formatCurrency(state.purchasePrice))],
    ["Price per unit", ...resultsSet.map(() => formatCurrency(state.purchasePrice / state.unitCount))],
    ["Equity Multiple", ...resultsSet.map(({ results }) => `${results.equityMultiple.toFixed(2)}x`)],
    ["ARR", ...resultsSet.map(({ results }) => formatPercent(results.annualizedReturn))],
    ["IRR", ...resultsSet.map(({ results }) => formatPercent(results.annualizedIrr))],
    ["Cash on Cash", ...resultsSet.map(({ results }) => formatPercent(results.cashOnCash))],
    ["Debt Yield", ...resultsSet.map(({ results }) => formatPercent(results.debtYield))],
    ["Year 1 NOI", ...resultsSet.map(({ results }) => formatCurrency(results.annualRows[0]?.noi ?? 0))]
  ];

  elements.comparisonTable.innerHTML = renderDataTable(columns, rows);
}

function renderDashboard(activeResult) {
  elements.readinessDashboard.innerHTML = renderDataTable(
    ["Metric", "Minimum", "Actual", "Status"],
    activeResult.results.readiness.map((item) => [
      item.metric,
      formatPercent(item.minimum),
      formatPercent(item.actual),
      item.passes ? "Within target" : "Below target"
    ])
  );

  elements.templateAlignment.innerHTML = `
    <div class="notes-panel">
      <p>The workbook tabs recovered from the spreadsheet have been translated into app views instead of a single page. This makes the web app reviewable using the same underwriting story as the Excel file.</p>
      <p><strong>Current active scenario:</strong> ${escapeHtml(activeResult.scenario.name)}</p>
      <p><strong>Primary structure:</strong> ${escapeHtml(state.primaryMethod)}</p>
    </div>
  `;

  elements.reviewerNotes.innerHTML = `
    <p>The spreadsheet centers around scenario comparison, executive summary, annual P&amp;L, acquisition sources and uses, exit/refi events, member returns, and debt schedules. Those are now mirrored as first-class views.</p>
    <p>Rent roll parsing, T-12 ingestion, and AI-assisted extraction remain modular placeholders for a later pass, but the review flow is preserved so that low-confidence values can still be flagged and edited.</p>
    <p>The math in this release is aligned to the workbook structure rather than every exact Excel cell formula. Once you provide precise spreadsheet logic you rely on most, we can close the remaining parity gap.</p>
  `;
}

function renderSummary(activeResult) {
  const { results } = activeResult;
  const metrics = [
    ["Purchase Price", formatCurrency(results.summary.purchasePrice)],
    ["Price / Unit", formatCurrency(results.summary.pricePerUnit)],
    ["Year 1 NOI", formatCurrency(results.summary.yearOneNoi)],
    ["Year 1 Debt Service", formatCurrency(results.summary.yearOneDebtService)],
    ["Equity Multiple", `${results.equityMultiple.toFixed(2)}x`],
    ["IRR", formatPercent(results.annualizedIrr)]
  ];

  elements.summaryMetrics.innerHTML = metrics
    .map(
      ([label, value]) => `<div class="metric-chip"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
    )
    .join("");

  elements.summaryTable.innerHTML = renderDataTable(
    ["Line", "Value"],
    [
      ["Asking Price", formatCurrency(results.summary.askingPrice)],
      ["Purchase Price", formatCurrency(results.summary.purchasePrice)],
      ["Earnest Money Deposit", formatCurrency(results.summary.earnestMoney)],
      ["Down Payment", formatCurrency(results.summary.downPayment)],
      ["1st Mortgage", formatCurrency(results.summary.firstMortgage)],
      ["2nd Mortgage / Seller Carry", formatCurrency(results.summary.secondMortgage)],
      ["Interest Rate", formatPercent(results.summary.interestRate)],
      ["DSCR", formatNumber(results.dscr)],
      ["Debt Yield", formatPercent(results.debtYield)],
      ["Break-Even Ratio", formatPercent(results.breakEvenRatio)]
    ]
  );
}

function renderPnl(activeResult) {
  elements.pnlTable.innerHTML = renderDataTable(
    [
      "Year",
      "Avg Monthly Rent",
      "Gross Rent",
      "Vacancy",
      "Concessions",
      "Other Income",
      "Total Income",
      "Expenses",
      "NOI",
      "Debt Service",
      "Cash Flow"
    ],
    activeResult.results.annualRows.map((row) => [
      row.year,
      formatCurrency(row.avgMonthlyRent),
      formatCurrency(row.grossScheduleRent),
      formatCurrency(-row.vacancy),
      formatCurrency(-row.concessionsBadDebt),
      formatCurrency(row.otherIncome),
      formatCurrency(row.totalIncome),
      formatCurrency(row.totalExpenses),
      formatCurrency(row.noi),
      formatCurrency(row.debtService),
      formatCurrency(row.cashFlowBeforeTax)
    ])
  );
}

function renderAcquisition(activeResult) {
  const acquisition = activeResult.results.acquisition;
  const investorCapital = state.lpClasses.reduce(
    (total, lpClass) => total + lpClass.classCount * lpClass.commitment,
    0
  );

  elements.acquisitionSummary.innerHTML = `
    <div class="metric-grid wide">
      <div class="metric-chip"><span>Total Uses</span><strong>${formatCurrency(acquisition.totalUses)}</strong></div>
      <div class="metric-chip"><span>Total Debt</span><strong>${formatCurrency(acquisition.totalDebt)}</strong></div>
      <div class="metric-chip"><span>Total Equity Required</span><strong>${formatCurrency(acquisition.totalEquityRequired)}</strong></div>
      <div class="metric-chip"><span>LP Capacity</span><strong>${formatCurrency(investorCapital)}</strong></div>
    </div>
    <div class="table-wrap">${renderDataTable(
      ["Use / Source", "Value"],
      [
        ["Purchase Price", formatCurrency(state.purchasePrice)],
        ["Closing Costs", formatCurrency(state.closingCosts)],
        ["Acquisition Fee", formatCurrency(acquisition.acquisitionFee)],
        ["Repair Escrows", formatCurrency(state.repairEscrows)],
        ["Operating Reserves", formatCurrency(state.operatingReserves)],
        ["Senior Debt", formatCurrency(state.loanAmount)],
        ["Seller Carry", formatCurrency(state.sellerCarryAmount)],
        ["GP Equity", formatCurrency(state.gpEquityContribution)],
        ["Earnest Money", formatCurrency(acquisition.earnestMoney)]
      ]
    )}</div>
  `;
}

function renderExit(activeResult) {
  const { refiSummary, sale } = activeResult.results.exit;

  elements.exitSummary.innerHTML = `
    <div class="metric-grid wide">
      <div class="metric-chip"><span>Refi Year</span><strong>${escapeHtml(String(activeResult.results.exit.refinanceYear || "None"))}</strong></div>
      <div class="metric-chip"><span>Sale Price</span><strong>${formatCurrency(sale.salePrice)}</strong></div>
      <div class="metric-chip"><span>Total Equity At Sale</span><strong>${formatCurrency(sale.totalEquityAtSale)}</strong></div>
      <div class="metric-chip"><span>Ending Loan Balance</span><strong>${formatCurrency(sale.endingLoanBalance)}</strong></div>
    </div>
    <div class="dual-grid">
      <div class="subcard">
        <h3>Refinance</h3>
        ${refiSummary ? renderDataTable(
          ["Line", "Value"],
          [
            ["Appraised Value", formatCurrency(refiSummary.appraisedValue)],
            ["New Loan Amount", formatCurrency(refiSummary.newLoanAmount)],
            ["Refi Costs", formatCurrency(refiSummary.refiCosts)],
            ["Outstanding Debt", formatCurrency(refiSummary.outstandingBalance)],
            ["Prepay Penalty", formatCurrency(refiSummary.prepayPenalty)],
            ["Capital Transaction Fee", formatCurrency(refiSummary.capitalTransactionFee)],
            ["Gross Refi Proceeds", formatCurrency(refiSummary.grossRefiProceeds)],
            ["Member Capital Returned", formatCurrency(refiSummary.memberCapitalReturned)],
            ["Member Profit Share", formatCurrency(refiSummary.memberProfitShare)],
            ["Manager Profit Share", formatCurrency(refiSummary.managerProfitShare)]
          ]
        ) : '<p class="section-note">No refinance event modeled.</p>'}
      </div>
      <div class="subcard">
        <h3>Sale</h3>
        ${renderDataTable(
          ["Line", "Value"],
          [
            ["Sale NOI", formatCurrency(sale.saleNoi)],
            ["Sale Price", formatCurrency(sale.salePrice)],
            ["Sale Costs", formatCurrency(sale.saleCosts)],
            ["Member Capital Returned", formatCurrency(sale.memberCapitalReturnedAtSale)],
            ["Member Preferred Return Paid", formatCurrency(sale.memberPrefPaidAtSale)],
            ["Capital Transaction Fee", formatCurrency(sale.capitalTransactionFeeAtSale)],
            ["Member Profit Share", formatCurrency(sale.memberProfitShareAtSale)],
            ["Manager Profit Share", formatCurrency(sale.managerProfitShareAtSale)]
          ]
        )}
      </div>
    </div>
  `;
}

function renderReturns(activeResult) {
  elements.returnsTable.innerHTML = renderDataTable(
    ["Year", "Member Cash Flow", "Cash on Cash", "Average CoC", "Average Annual Return", "Capital Event Proceeds"],
    activeResult.results.returnsRows.map((row) => [
      row.year,
      formatCurrency(row.memberCashFlow),
      formatPercent(row.cashOnCash),
      formatPercent(row.avgCashOnCash),
      formatPercent(row.averageAnnualReturnToDate),
      formatCurrency(row.proceedsFromCapitalEvent)
    ])
  );

  elements.irrTable.innerHTML = renderDataTable(
    ["Year", "Quarter", "Month", "Quarterly Cash Flow"],
    activeResult.results.quarterlyCashFlows.map((row) => [
      row.year,
      row.quarter,
      row.month,
      formatCurrency(row.cashFlow)
    ])
  );
}

function renderLoans(activeResult) {
  elements.loanTables.innerHTML = activeResult.results.loanTables
    .map(
      (table) => `
        <article class="subcard loan-card">
          <h3>${escapeHtml(table.title)}</h3>
          ${renderDataTable(
            ["Year", "Principal Paid", "Interest Paid", "Debt Service", "Ending Balance"],
            table.rows.map((row) => [
              row.year,
              formatCurrency(row.principalPaid),
              formatCurrency(row.interestPaid),
              formatCurrency(row.debtService),
              formatCurrency(row.endingBalance)
            ])
          )}
        </article>
      `
    )
    .join("");
}

function renderQuickAnalysis(activeResult) {
  const quick = activeResult.results.quickAnalysis;
  const loi = activeResult.results.loiAnalysis;

  elements.quickAnalysis.innerHTML = renderDataTable(
    ["Metric", "Value"],
    [
      ["Gross Potential Annual Income", formatCurrency(quick.grossPotentialAnnualIncome)],
      ["Vacancy Rate", formatPercent(quick.vacancyRate)],
      ["Expense Rate", formatPercent(quick.expenseRate)],
      ["NOI Valuation", formatCurrency(quick.valuation)],
      ["Market Cap Rate", formatPercent(quick.marketCapRate)]
    ]
  );

  elements.loiAnalysis.innerHTML = renderDataTable(
    ["Metric", "Value"],
    [
      ["Asking Price", formatCurrency(loi.askingPrice)],
      ["Purchase Price", formatCurrency(loi.purchasePrice)],
      ["NOI", formatCurrency(loi.noi)],
      ["Interest Rate", formatPercent(loi.interestRate)],
      ["Maximum Annual Loan Payment", formatCurrency(loi.maximumAnnualLoanPayment)],
      ["Max Loan Amount", formatCurrency(loi.maxLoanAmount)],
      ["Down Payment", formatCurrency(loi.downPayment)],
      ["Down Payment %", formatPercent(loi.downPaymentPct)]
    ]
  );
}

function renderTemplateMapping() {
  elements.templateMapping.innerHTML = renderDataTable(
    ["Workbook Tab", "Web App Translation"],
    workbookTabs.map((tab) => [
      tab,
      ({
        About: "Dashboard",
        Scenarios: "Scenarios",
        Summary: "Summary",
        "P&L": "P&L",
        "Acquisition Costs": "Acquisition",
        "Exit Strategy": "Exit Strategy",
        Returns: "Returns",
        IRR: "Returns / IRR",
        Loans: "Loans",
        "1st Mortgage 1": "Loans",
        "2nd Mortgage 1": "Loans",
        "1st Mortgage Re-Fi": "Loans",
        "2-Minute Analysis": "Quick Screen",
        "MinMax LOI Analysis": "Quick Screen"
      }[tab] ?? "Inputs / future specialty view")
    ])
  );
}

function rerender() {
  syncInputsFromState();
  rerenderTabs();
  renderLayeredMethods();
  renderMemberTables();
  renderDocuments(elements.documentList);
  renderDocuments(elements.docsViewDocumentList);
  renderTemplateMapping();

  const resultsSet = getResultsSet();
  const activeResult = getActiveResult(resultsSet);

  renderScenarioGrid(resultsSet);
  renderComparisonTable(resultsSet);
  renderDashboard(activeResult);
  renderSummary(activeResult);
  renderPnl(activeResult);
  renderAcquisition(activeResult);
  renderExit(activeResult);
  renderReturns(activeResult);
  renderLoans(activeResult);
  renderQuickAnalysis(activeResult);
}

seedSelects();
bindInputs();
bindTabs();
bindDocumentUpload();
rerender();
