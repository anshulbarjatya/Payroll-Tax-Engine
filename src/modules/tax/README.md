# Tax Module

Income tax computation, slab lookup, monthly TDS, and annual projections.

## Endpoints

| Method | Path                      | Description                |
| ------ | ------------------------- | -------------------------- |
| POST   | `/tax/compute-income-tax` | Slab-based income tax      |
| GET    | `/tax/slabs`              | Get configured tax slabs   |
| POST   | `/tax/compute-tds`        | Monthly TDS calculation    |
| POST   | `/tax/annual-projection`  | Full-year tax projection   |

Supports old and new tax regimes for India FY 2025-26.
