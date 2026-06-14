# Statutory Module

Country-aware statutory contribution calculations. Each country returns its own schemes with **employee and employer** amounts.

## Endpoints

| Method | Path                        | Description                    |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/statutory/contributions`  | **Generic** — pass `countryCode` |
| POST   | `/statutory/pf`             | India EPF only (legacy)        |
| POST   | `/statutory/esi`            | India ESI only (legacy)        |

## Country Schemes

| Country | Schemes |
|---------|---------|
| IN | EPF, EPS, EDLI, ESI, Professional Tax, Gratuity |
| US | Social Security, Medicare, FUTA |
| UK | National Insurance, Auto-Enrolment Pension |
| SG | CPF, SDL |
