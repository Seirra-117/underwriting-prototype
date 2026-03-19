# Workbook Mapping Notes

The workbook `20260311 Veranda UW.xlsx` was inspected directly from its Excel XML structure. The app is now organized to mirror the main underwriting flow found in these reference tabs:

- `About` -> deal readiness dashboard
- `Scenarios` -> side-by-side scenario editing
- `Summary` -> executive summary
- `P&L` -> annual operating projections
- `Acquisition Costs` -> sources and uses
- `Exit Strategy` -> refinance and sale views
- `Returns` and `IRR` -> annual and quarterly cash flow views
- `Loans`, `1st Mortgage 1`, `2nd Mortgage 1`, `1st Mortgage Re-Fi` -> debt tables
- `2-Minute Analysis` and `MinMax LOI Analysis` -> quick screen tools

Still not fully mirrored:

- exact spreadsheet cell-for-cell formulas
- rent comp modeling detail
- CapEx line-item budget depth
- tax calculator logic by county formula
- insurance quote worksheet
- specialty lender term presets
- Excel import/export parity

The goal of this release is to match the workbook's underwriting narrative and major functional areas first, then tighten exact formula parity in later iterations.
