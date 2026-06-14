import { SalaryComponentType } from '../../common/enums/salary-component-type.enum';
import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { TaxRules } from '../../common/interfaces/tax-slab.interface';

export const UK_STATUTORY = {
  niPrimaryThreshold: 12570,
  niUpperEarningsLimit: 50270,
  niSecondaryThreshold: 9100,
  niEmployeeMainRate: 0.08,
  niEmployeeUpperRate: 0.02,
  niEmployerRate: 0.138,
  pensionEmployeeRate: 0.05,
  pensionEmployerRate: 0.03,
  pensionQualifyingThreshold: 6240,
};

export const UK_INCOME_TAX_SLABS = [
  { min: 0, max: 37700, rate: 0.2 },
  { min: 37701, max: 125140, rate: 0.4 },
  { min: 125141, max: null, rate: 0.45 },
];

export const UK_SALARY_COMPONENTS: SalaryComponent[] = [
  { name: 'Basic Salary', type: SalaryComponentType.PERCENTAGE_OF_CTC, value: 80, isTaxable: true },
  { name: 'Allowances', type: SalaryComponentType.BALANCING_FIGURE, value: 0, isTaxable: true },
];

export function getUkTaxRules(financialYear: string, regime: string): TaxRules {
  return {
    countryCode: 'UK',
    financialYear,
    regime,
    standardDeduction: 12570,
    rebateLimit: 0,
    rebateAmount: 0,
    cessRate: 0,
    slabs: UK_INCOME_TAX_SLABS,
    deductionLimits: {},
  };
}
