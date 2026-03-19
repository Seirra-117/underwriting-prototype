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

const presets = {
  balanced: {
    economicOccupancy: 93,
    leaseUpPerMonth: 3,
    renoUnitsPerMonth: 2,
    rentGrowth: 3,
    expenseGrowth: 3.5,
    renoPremium: 125
  },
  conservative: {
    economicOccupancy: 90,
    leaseUpPerMonth: 2,
    renoUnitsPerMonth: 1,
    rentGrowth: 2,
    expenseGrowth: 4,
    renoPremium: 80
  },
  aggressive: {
    economicOccupancy: 95,
    leaseUpPerMonth: 4,
    renoUnitsPerMonth: 3,
    rentGrowth: 4,
    expenseGrowth: 3,
    renoPremium: 175
  }
};

const state = {
  projectName: "Phoenix Value Add 128",
  dealStatus: "screening",
  marketName: "Phoenix, AZ",
  unitCount: 128,
  assumptionPreset: "balanced",
  targetArr: 14,
  targetIrr: 16,
  targetCoc: 8,
  avgRent: 1325,
  marketRent: 1490,
  otherIncomePerUnit: 45,
  economicOccupancy: 93,
  leaseUpPerMonth: 3,
  renoUnitsPerMonth: 2,
  renoPremium: 125,
  rentGrowth: 3,
  expenseGrowth: 3.5,
  opexPerUnit: 420,
  propertyTaxes: 210000,
  insurance: 88000,
  payroll: 192000,
  repairs: 168000,
  managementFee: 3,
  replacementReserve: 325,
  purchasePrice: 18600000,
  closingCosts: 420000,
  loanAmount: 13020000,
  interestRate: 6.35,
  amortYears: 30,
  ioMonths: 12,
  sellerCarryAmount: 1200000,
  sellerCarryRate: 4.5,
  sellerCarryAmortYears: 20,
  holdYears: 5,
  exitCapRate: 6.25,
  saleCostsPct: 2,
  refiYear: 3,
  refiRate: 6,
  refiLtv: 70,
  refiCapRate: 6,
  prepayPenaltyPct: 1.5,
  capitalTransactionFeePct: 1,
  acquisitionMethod: "Multiple",
  primaryMethod: "Syndication",
  selectedMethods: ["Syndication", "Assumable Loan", "Seller Finance"],
  waterfallMode: "pref-and-promote",
  lpPrefRate: 8,
  gpPromoteShare: 30,
  gpEquityContribution: 900000,
  gpMembers: [
    { name: "Sponsor Manager", ownershipPct: 60, contribution: 540000 },
    { name: "Operating Partner", ownershipPct: 40, contribution: 360000 }
  ],
  lpClasses: [
    { label: "$5K Class", ticketSize: 5000, classCount: 20, commitment: 5000 },
    { label: "$50K Class", ticketSize: 50000, classCount: 12, commitment: 50000 },
    { label: "$100K Class", ticketSize: 100000, classCount: 16, commitment: 100000 },
    { label: "$500K Class", ticketSize: 500000, classCount: 6, commitment: 500000 }
  ],
  documents: [],
  scenarios: [
    {
      id: "base",
      name: "Base",
      vacancyDelta: 0,
      rentGrowthDelta: 0,
      expenseGrowthDelta: 0,
      renoPremiumDelta: 0,
      otherIncomeDelta: 0,
      leaseUpPerMonth: 3,
      renoUnitsPerMonth: 2,
      exitCapDelta: 0
    },
    {
      id: "upside",
      name: "Upside",
      vacancyDelta: -1,
      rentGrowthDelta: 1,
      expenseGrowthDelta: -0.5,
      renoPremiumDelta: 40,
      otherIncomeDelta: 8,
      leaseUpPerMonth: 4,
      renoUnitsPerMonth: 3,
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
      leaseUpPerMonth: 2,
      renoUnitsPerMonth: 1,
      exitCapDelta: 0.35
    },
    {
      id: "refi-heavy",
      name: "Refi Focus",
      vacancyDelta: 0.5,
      rentGrowthDelta: 0.25,
      expenseGrowthDelta: 0,
      renoPremiumDelta: 20,
      otherIncomeDelta: 0,
      leaseUpPerMonth: 3,
      renoUnitsPerMonth: 2,
      exitCapDelta: -0.1
    }
  ]
};

// These fields are wired directly to the baseline assumptions panel and become the
// source-of-truth inputs for every scenario run.
const numericFieldIds = [
  "unitCount",
  "targetArr",
  "targetIrr",
  "targetCoc",
  "avgRent",
  "marketRent",
  "otherIncomePerUnit",
  "economicOccupancy",
  "leaseUpPerMonth",
  "renoUnitsPerMonth",
  "renoPremium",
  "rentGrowth",
  "expenseGrowth",
  "opexPerUnit",
  "propertyTaxes",
  "insurance",
  "payroll",
  "repairs",
  "managementFee",
  "replacementReserve",
  "purchasePrice",
  "closingCosts",
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
  "prepayPenaltyPct",
  "capitalTransactionFeePct",
  "lpPrefRate",
  "gpPromoteShare",
  "gpEquityContribution"
];

const elements = {
  documentUpload: document.querySelector("#documentUpload"),
  documentList: document.querySelector("#documentList"),
  assumptionPreset: document.querySelector("#assumptionPreset"),
  acquisitionMethod: document.querySelector("#acquisitionMethod"),
  primaryMethod: document.querySelector("#primaryMethod"),
  layeredMethods: document.querySelector("#layeredMethods"),
  gpTable: document.querySelector("#gpTable"),
  lpTable: document.querySelector("#lpTable"),
  scenarioGrid: document.querySelector("#scenarioGrid"),
  comparisonTable: document.querySelector("#comparisonTable"),
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
}

function bindBaseInputs() {
  ["projectName", "dealStatus", "marketName", "waterfallMode"].forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.value = state[id];
    input.addEventListener("input", () => {
      state[id] = input.value;
      rerender();
    });
  });

  numericFieldIds.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.value = state[id];
    input.addEventListener("input", () => {
      state[id] = Number(input.value);
      rerender();
    });
  });

  elements.assumptionPreset.value = state.assumptionPreset;
  elements.assumptionPreset.addEventListener("change", () => {
    state.assumptionPreset = elements.assumptionPreset.value;
    Object.assign(state, presets[state.assumptionPreset]);
    syncInputsFromState();
    rerender();
  });

  elements.acquisitionMethod.value = state.acquisitionMethod;
  elements.acquisitionMethod.addEventListener("change", () => {
    state.acquisitionMethod = elements.acquisitionMethod.value;
    if (state.acquisitionMethod !== "Multiple") {
      state.selectedMethods = [state.acquisitionMethod];
      state.primaryMethod = state.acquisitionMethod;
    }
    rerender();
  });

  elements.primaryMethod.value = state.primaryMethod;
  elements.primaryMethod.addEventListener("change", () => {
    state.primaryMethod = elements.primaryMethod.value;
    rerender();
  });

  elements.recalculateButton.addEventListener("click", rerender);
}

function syncInputsFromState() {
  [...numericFieldIds, "projectName", "dealStatus", "marketName", "waterfallMode"].forEach((id) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = state[id];
  });

  elements.assumptionPreset.value = state.assumptionPreset;
  elements.acquisitionMethod.value = state.acquisitionMethod;
  elements.primaryMethod.value = state.primaryMethod;
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

// Version 1 intentionally uses deterministic extraction placeholders so reviewers
// can inspect the review workflow before OCR/AI services are introduced.
function generateDraftExtraction(type) {
  const templates = {
    "Rent Roll": [
      { label: "Average in-place rent", value: state.avgRent, confidence: 0.91 },
      { label: "Economic occupancy", value: `${state.economicOccupancy}%`, confidence: 0.83 }
    ],
    "T-12": [
      { label: "Annual repairs", value: formatCurrency(state.repairs), confidence: 0.88 },
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

function renderDocuments() {
  elements.documentList.innerHTML = "";

  if (state.documents.length === 0) {
    const empty = document.createElement("p");
    empty.className = "section-note";
    empty.textContent = "No files uploaded yet. Once files are added, the prototype will draft extraction rows and highlight lower-confidence items.";
    elements.documentList.append(empty);
    return;
  }

  state.documents.forEach((doc) => {
    const item = document.createElement("article");
    item.className = "document-item";

    const summary = document.createElement("div");
    summary.innerHTML = `<strong>${doc.name}</strong><br /><span>${doc.type}</span>`;

    const confidence = Math.min(...doc.extractionItems.map((entry) => entry.confidence));
    const confidenceNode = document.createElement("div");
    confidenceNode.className = confidence >= 0.85 ? "confidence-high" : "confidence-low";
    confidenceNode.textContent = `${Math.round(confidence * 100)}% min confidence`;

    const extracted = document.createElement("div");
    extracted.innerHTML = doc.extractionItems
      .map((entry) => `<div><strong>${entry.label}:</strong> ${entry.value}</div>`)
      .join("");

    item.append(summary, confidenceNode, extracted);
    elements.documentList.append(item);
  });
}

function renderLayeredMethods() {
  elements.layeredMethods.innerHTML = "";

  if (state.acquisitionMethod !== "Multiple") {
    const note = document.createElement("p");
    note.className = "section-note";
    note.textContent = `Using a single acquisition method: ${state.acquisitionMethod}.`;
    elements.layeredMethods.append(note);
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
          elements.primaryMethod.value = state.primaryMethod;
        }

        rerender();
      });

      const text = document.createElement("span");
      text.textContent = method;
      label.append(checkbox, text);
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
      <label>Member<input data-group="gp" data-index="${index}" data-key="name" type="text" value="${member.name}" /></label>
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
      <label>Class<input data-group="lp" data-index="${index}" data-key="label" type="text" value="${lpClass.label}" /></label>
      <label>Investors<input data-group="lp" data-index="${index}" data-key="classCount" type="number" value="${lpClass.classCount}" /></label>
      <label>Commitment<input data-group="lp" data-index="${index}" data-key="commitment" type="number" value="${lpClass.commitment}" /></label>
    `;
    elements.lpTable.append(row);
  });

  document.querySelectorAll("[data-group]").forEach((input) => {
    input.addEventListener("input", () => {
      const { group, index, key } = input.dataset;
      const collection = group === "gp" ? state.gpMembers : state.lpClasses;
      const currentValue = input.type === "number" ? Number(input.value) : input.value;
      collection[Number(index)][key] = currentValue;

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

function createScenarioCard(scenario, results) {
  const article = document.createElement("article");
  article.className = "scenario-card";

  const summaryMetrics = [
    { label: "Equity Multiple", value: `${results.equityMultiple.toFixed(2)}x` },
    { label: "ARR", value: formatPercent(results.annualizedReturn) },
    { label: "IRR", value: formatPercent(results.annualizedIrr) },
    { label: "CoC", value: formatPercent(results.cashOnCash) },
    { label: "DSCR", value: results.dscr.toFixed(2) },
    { label: "Debt Yield", value: formatPercent(results.debtYield) }
  ];

  article.innerHTML = `
    <div class="scenario-header">
      <div>
        <p class="section-kicker">Scenario</p>
        <h3>${scenario.name}</h3>
      </div>
      <div>
        <strong>${formatPercent(results.baselineCapRate)}</strong>
        <p class="section-note">Baseline cap rate</p>
      </div>
    </div>
    <div class="form-grid two-up compact">
      <label>Vacancy delta<input data-scenario="${scenario.id}" data-key="vacancyDelta" type="number" step="0.1" value="${scenario.vacancyDelta}" /></label>
      <label>Rent growth delta<input data-scenario="${scenario.id}" data-key="rentGrowthDelta" type="number" step="0.1" value="${scenario.rentGrowthDelta}" /></label>
      <label>Expense growth delta<input data-scenario="${scenario.id}" data-key="expenseGrowthDelta" type="number" step="0.1" value="${scenario.expenseGrowthDelta}" /></label>
      <label>Reno premium delta<input data-scenario="${scenario.id}" data-key="renoPremiumDelta" type="number" step="1" value="${scenario.renoPremiumDelta}" /></label>
      <label>Other income delta<input data-scenario="${scenario.id}" data-key="otherIncomeDelta" type="number" step="1" value="${scenario.otherIncomeDelta}" /></label>
      <label>Lease-up units / month<input data-scenario="${scenario.id}" data-key="leaseUpPerMonth" type="number" step="1" value="${scenario.leaseUpPerMonth}" /></label>
      <label>Reno units / month<input data-scenario="${scenario.id}" data-key="renoUnitsPerMonth" type="number" step="1" value="${scenario.renoUnitsPerMonth}" /></label>
      <label>Exit cap delta<input data-scenario="${scenario.id}" data-key="exitCapDelta" type="number" step="0.05" value="${scenario.exitCapDelta}" /></label>
    </div>
  `;

  const metricGrid = document.createElement("div");
  metricGrid.className = "metric-grid";

  summaryMetrics.forEach((metric) => {
    const chip = document.createElement("div");
    chip.className = "metric-chip";
    chip.innerHTML = `<span>${metric.label}</span><strong>${metric.value}</strong>`;
    metricGrid.append(chip);
  });

  const annualSnippet = document.createElement("div");
  annualSnippet.className = "notes-panel";
  annualSnippet.innerHTML = `
    <p><strong>Year 1 NOI:</strong> ${formatCurrency(results.annualRows[0]?.noi ?? 0)}</p>
    <p><strong>Year 1 debt service:</strong> ${formatCurrency(results.annualRows[0]?.debtService ?? 0)}</p>
    <p><strong>Sale waterfall residual to LP/GP:</strong> ${formatCurrency((results.saleDistribution.lpProfitShare ?? 0) + (results.saleDistribution.gpProfitShare ?? 0))}</p>
  `;

  article.append(metricGrid, annualSnippet);
  return article;
}

function renderScenarios() {
  elements.scenarioGrid.innerHTML = "";

  // Each scenario begins with the shared baseline state and layers its own deltas
  // for vacancy, growth, lease-up pace, renovation pace, and terminal pricing.
  const resultsSet = state.scenarios.map((scenario) => ({
    scenario,
    results: window.runScenarioUnderwriting(state, scenario)
  }));

  resultsSet.forEach(({ scenario, results }) => {
    const card = createScenarioCard(scenario, results);
    elements.scenarioGrid.append(card);
  });

  document.querySelectorAll("[data-scenario]").forEach((input) => {
    input.addEventListener("input", () => {
      const scenario = state.scenarios.find((entry) => entry.id === input.dataset.scenario);
      scenario[input.dataset.key] = Number(input.value);
      rerender();
    });
  });

  renderComparisonTable(resultsSet);
}

function renderComparisonTable(resultsSet) {
  elements.comparisonTable.innerHTML = "";

  const rows = [
    {
      label: "Equity Multiple",
      formatter: (results) => `${results.equityMultiple.toFixed(2)}x`
    },
    {
      label: "Annualized Return",
      formatter: (results) => formatPercent(results.annualizedReturn)
    },
    {
      label: "IRR",
      formatter: (results) => formatPercent(results.annualizedIrr)
    },
    {
      label: "Cash-on-Cash",
      formatter: (results) => formatPercent(results.cashOnCash)
    },
    {
      label: "DSCR",
      formatter: (results) => results.dscr.toFixed(2)
    },
    {
      label: "Break-even ratio",
      formatter: (results) => formatPercent(results.breakEvenRatio)
    },
    {
      label: "Debt yield",
      formatter: (results) => formatPercent(results.debtYield)
    }
  ];

  rows.forEach((rowConfig) => {
    const row = document.createElement("div");
    row.className = "comparison-row";
    row.innerHTML = [
      `<strong>${rowConfig.label}</strong>`,
      ...resultsSet.map(({ results }) => `<span>${rowConfig.formatter(results)}</span>`)
    ].join("");
    elements.comparisonTable.append(row);
  });
}

function rerender() {
  renderDocuments();
  renderLayeredMethods();
  renderMemberTables();
  renderScenarios();
}

seedSelects();
bindBaseInputs();
bindDocumentUpload();
syncInputsFromState();
rerender();
