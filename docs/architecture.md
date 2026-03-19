# Architecture Notes

## Why this first draft is lightweight

The purpose of this version is to validate workflow, modeling expectations, and reviewer comprehension before committing to a heavier production stack. That keeps the underwriting logic exposed and easy to refine after your Excel reference model is introduced.

## Proposed production path after review

1. Frontend: React with TypeScript for maintainable state management and scenario editing.
2. Backend: Node.js API for document persistence, underwriting runs, and export generation.
3. Database: PostgreSQL for deals, scenarios, members, extracted fields, and future audit logs.
4. Storage: object storage for uploaded broker documents.
5. OCR pipeline: document classification plus structured extraction service.
6. AI layer: optional account-level feature toggle for summarization, discrepancy flagging, and recommendation support.

## Recommended domain model

- Deal
- DealDocument
- ExtractedField
- AssumptionSet
- AcquisitionStructure
- CapitalMember
- CapitalClass
- Scenario
- ProjectionRun
- DistributionEvent
- ExportTemplate

## Near-term development sequence

1. Replace in-memory state with persisted deals and scenarios.
2. Introduce spreadsheet import mapping against your reference workbook.
3. Add versioned extracted fields and manual review states.
4. Add export generation for investor memo, Excel, and PDF.
5. Add authentication and audit trail for multi-user reviews.
