# Payroll Tax Engine

Country-agnostic payroll and tax calculation backend built with NestJS.

## Supported Countries

| Code | Country   | Currency | Statutory Schemes                          |
|------|-----------|----------|--------------------------------------------|
| IN   | India     | INR      | EPF, ESI, Professional Tax, Gratuity       |
| US   | USA       | USD      | Social Security, Medicare, FUTA            |
| UK   | UK        | GBP      | National Insurance, Auto-Enrolment Pension |
| SG   | Singapore | SGD      | CPF, Skills Development Levy (SDL)         |

## Architecture

```
src/
├── core/              # Generic engine (NO country logic)
│   ├── payroll.engine.ts
│   ├── country-registry.service.ts
│   └── calculators/
├── countries/         # Country plugins (rules + strategy)
│   ├── india/
│   ├── us/
│   ├── uk/
│   └── singapore/
└── modules/           # REST API
```

**Same calculation flow for every country:**
1. Split CTC → salary components
2. Calculate statutory (employee + employer)
3. Calculate income tax
4. Return breakdown with `employerCostSummary`

## Quick Start

```bash
npm install && npm run start:dev
# http://localhost:3000/api/v1
```

## Multi-Country Example

```bash
# India
curl -X POST http://localhost:3000/api/v1/payroll/quick-ctc \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"IN","financialYear":"2025-26","taxRegime":"new","state":"MH","ctc":1200000}'

# USA
curl -X POST http://localhost:3000/api/v1/payroll/quick-ctc \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"US","financialYear":"2025","taxRegime":"standard","ctc":120000}'

# UK
curl -X POST http://localhost:3000/api/v1/payroll/quick-ctc \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"UK","financialYear":"2025-26","taxRegime":"standard","ctc":60000}'

# Singapore
curl -X POST http://localhost:3000/api/v1/payroll/quick-ctc \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"SG","financialYear":"2025","taxRegime":"standard","ctc":96000}'

# Statutory (any country)
curl -X POST http://localhost:3000/api/v1/statutory/contributions \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"US","financialYear":"2025","grossMonthly":10000}'
```

## Postman Collection

```bash
#Link:
https://anshulj31-9637548.postman.co/workspace/Anshul-jain's-Workspace~9736d29f-8547-4d84-8889-14a56a445cff/collection/55531051-1b73b468-365b-443b-85e8-0107e8ca04b5?sideView=agentMode
```

Every payroll response includes `employerContributions` and `employerCostSummary`.
