# Core Payroll Engine

Country-agnostic calculation engine. **No country-specific logic lives here.**

## Flow (same for every country)

```
1. Resolve country strategy by country_code
2. Split CTC into salary components (generic SalaryCalculator)
3. strategy.calculateStatutory() → employee + employer contributions
4. strategy.calculateTax() → income tax / withholding
5. Assemble PayrollBreakdown with employerCostSummary
```

## Key files

| File | Role |
|------|------|
| `payroll.engine.ts` | Generic orchestrator — identical logic for IN/US/UK/SG |
| `country-registry.service.ts` | Routes `country_code` → strategy plugin |
| `calculators/salary.calculator.ts` | CTC → component breakdown |
| `calculators/slab-tax.calculator.ts` | Progressive slab tax (shared math) |

## Adding a country

1. Create `src/countries/{code}/{code}.rules.ts` — rates & slabs
2. Create `src/countries/{code}/{code}.strategy.ts` — implement `CountryPayrollStrategy`
3. Register in `CountryRegistryService`

The core engine never changes.
