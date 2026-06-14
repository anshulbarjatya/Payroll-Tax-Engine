# Employee Module

CRUD-lite employee management with in-memory JSON persistence.

## Endpoints

| Method | Path                          | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/employees`                  | Create employee          |
| GET    | `/employees/:idOrCode`        | Get employee by UUID or employee code (e.g. `EMP001`) |
| PATCH  | `/employees/:idOrCode/tax-regime` | Switch old/new tax regime |

## Validation

- PAN must match `AAAAA9999A` format
- Duplicate `employeeCode` or `email` returns 409
