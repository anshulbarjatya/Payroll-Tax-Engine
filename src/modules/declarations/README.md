# Declarations Module

Investment and tax-saving declarations (80C, 80D, HRA, LTA, etc.).

## Endpoints

| Method | Path                                    | Description           |
| ------ | --------------------------------------- | --------------------- |
| POST   | `/declarations`                         | Submit declaration    |
| GET    | `/declarations/:employeeId/status`      | Get declaration status |

Declarations feed into old-regime payroll and tax calculations.
