# Payslip & Reports Module

Payslip generation, Form 16 data, payroll summary, and statutory compliance reports.

## Endpoints

| Method | Path                                    | Description                |
| ------ | --------------------------------------- | -------------------------- |
| GET    | `/reports/payslip/:employeeId`          | Monthly payslip            |
| GET    | `/reports/form16/:employeeId`           | Form 16 tax certificate    |
| GET    | `/reports/payroll-summary`              | Org-wide payroll summary   |
| GET    | `/reports/statutory-compliance`         | PF/ESI/PT compliance flags |

Query params: `month`, `financial_year`.
