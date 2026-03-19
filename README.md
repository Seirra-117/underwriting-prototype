# Multifamily Underwriting Prototype

This is a first-pass web prototype for a multifamily underwriting application. It is intentionally built with plain HTML, CSS, and JavaScript so reviewers can inspect the logic without a bundler, server runtime, or external dependencies.

## What is implemented

- Single-user web interface for multifamily underwriting
- Project setup and deal status workflow
- Broker document upload intake with placeholder extraction rows and confidence flags
- Editable baseline assumptions for income, expenses, debt, refinance, and disposition
- Acquisition method selector with support for layered structures in `Multiple` mode
- GP and LP class modeling for syndication and joint venture style capital stacks
- Four side-by-side scenario cards with editable deltas
- Underwriting engine for:
  - monthly and annual projections
  - equity multiple
  - annualized rate of return
  - annualized IRR
  - cash-on-cash
  - DSCR
  - break-even ratio
  - debt yield
  - baseline cap rate
  - refinance and sale distribution logic

## What is intentionally stubbed for later phases

- OCR and AI-backed document extraction
- File persistence and cloud storage
- User accounts and audit trail
- Excel import/export
- PDF memo generation
- Deep spreadsheet parity with your existing underwriting model
- Phase 2 member buyout event logic

## How to run

Open [index.html](/home/osiris/ws/repos/underwriting-prototype/index.html) in a browser.

If you want a lightweight local server for easier browser testing, run:

```bash
cd /home/osiris/ws/repos/underwriting-prototype
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## File guide

- [index.html](/home/osiris/ws/repos/underwriting-prototype/index.html): reviewer-facing UI shell and app layout
- [styles.css](/home/osiris/ws/repos/underwriting-prototype/styles.css): visual system and responsive layout
- [app.js](/home/osiris/ws/repos/underwriting-prototype/app.js): state, event handling, UI rendering, and scenario comparison logic
- [underwriting-engine.js](/home/osiris/ws/repos/underwriting-prototype/underwriting-engine.js): underwriting formulas, debt schedules, and waterfall distribution logic

## Notes for reviewers

- The code is commented through naming and separation rather than excessive inline commentary.
- AI integration should be added behind the document extraction hooks in [app.js](/home/osiris/ws/repos/underwriting-prototype/app.js) and not embedded directly into the UI layer.
- The refinance event currently assumes replacement of the original debt stack and applies the order you specified: debt payoff, prepayment penalty, capital transaction fee, return of capital, then remaining distributions.
- The annualized return is currently modeled as the compounded annual return implied by equity multiple over the hold period. If your reference spreadsheet uses a different ARR formula, we can swap it cleanly in the engine.
