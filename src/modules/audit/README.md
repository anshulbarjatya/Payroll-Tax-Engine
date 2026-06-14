# Audit & Compliance Module

Audit trail, PAN validation, and compliance flag checks.

## Endpoints

| Method | Path                              | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/audit/trail`                    | Get audit trail          |
| POST   | `/audit/validate-pan`             | Validate PAN format      |
| GET    | `/audit/compliance/:employeeId`   | Compliance status check  |

Optional query filters: `entity_id`, `entity_type`.
