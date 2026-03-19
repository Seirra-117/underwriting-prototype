# Multifamily Underwriting Prototype

This prototype is now organized around the structure of the reference workbook `20260311 Veranda UW.xlsx`. Instead of a single-page underwriting sheet, the app mirrors the workbook's core underwriting story through dedicated web views.

## Current web views

- Dashboard
- Inputs
- Scenarios
- Summary
- P&L
- Acquisition
- Exit Strategy
- Returns
- Loans
- Quick Screen
- Docs

## What the current release mirrors from the workbook

- Readiness dashboard logic similar to `About`
- Side-by-side scenario comparison similar to `Scenarios`
- Executive summary similar to `Summary`
- Annual operating projection view similar to `P&L`
- Sources and uses view similar to `Acquisition Costs`
- Refinance and sale view similar to `Exit Strategy`
- Member return and IRR support views similar to `Returns` and `IRR`
- Annualized loan schedules similar to `Loans`, `1st Mortgage 1`, `2nd Mortgage 1`, and `1st Mortgage Re-Fi`
- Quick underwriting screens similar to `2-Minute Analysis` and `MinMax LOI Analysis`

## What is still approximate

- Exact cell-for-cell parity with the spreadsheet formulas
- Rent comps detail and floorplan-level rent target modeling
- Full CapEx budget worksheet depth
- Property tax worksheet logic by county formula
- Insurance and lender term specialty worksheets
- Excel import/export parity
- OCR and AI-backed extraction
- Multi-user audit trail

## How to run

Open [index.html](/home/osiris/ws/repos/underwriting-prototype/index.html) in a browser.

## Key files

- [index.html](/home/osiris/ws/repos/underwriting-prototype/index.html): workbook-style app shell and view containers
- [styles.css](/home/osiris/ws/repos/underwriting-prototype/styles.css): visual system, responsive layout, and workbook-like presentation
- [app.js](/home/osiris/ws/repos/underwriting-prototype/app.js): state, tabbed rendering, scenario editing, and workbook view generation
- [underwriting-engine.js](/home/osiris/ws/repos/underwriting-prototype/underwriting-engine.js): underwriting calculations, refinance logic, returns, and debt summaries
- [template-mapping.md](/home/osiris/ws/repos/underwriting-prototype/docs/template-mapping.md): notes on how the spreadsheet was mapped into the app

## Notes

- The spreadsheet was reviewed by reading the workbook XML directly in this environment.
- The current app is intended to match the workbook's functional shape first, then tighten formula parity in later passes.
- Once you identify the most critical formula regions in the spreadsheet, those can be ported with much higher fidelity.
