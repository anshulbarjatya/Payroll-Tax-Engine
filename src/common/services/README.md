# Audit Service

Records immutable audit entries for payroll-related actions.

## Actions Logged

- Employee create/update and tax regime changes
- Salary structure creation
- Payroll calculations
- Investment declarations
- PAN validation

## Storage

Entries are persisted via `LocalStorageService` in `data/audit_trail.json`.
