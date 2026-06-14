# Payroll Module

Full payroll calculation, quick CTC estimates, regime comparison, and bulk runs.

## Endpoints

| Method | Path                        | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| POST   | `/payroll/calculate`        | Full payroll run with breakdown     |
| POST   | `/payroll/quick-ctc`        | Fast take-home estimate from CTC    |
| POST   | `/payroll/compare-regimes`  | Old vs new regime comparison        |
| POST   | `/payroll/bulk`             | Process multiple employees          |

Returns earnings, deductions, employer contributions, tax details, and net pay.
