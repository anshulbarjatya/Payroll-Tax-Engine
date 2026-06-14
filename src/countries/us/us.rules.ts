import { SalaryComponentType } from '../../common/enums/salary-component-type.enum';
import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { TaxRules } from '../../common/interfaces/tax-slab.interface';

export const US_STATUTORY = {
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 168600,
  medicareRate: 0.0145,
  futaRate: 0.006,
  futaWageBase: 7000,
};

export const US_FEDERAL_SLABS = [
  { min: 0, max: 11600, rate: 0.1 },
  { min: 11601, max: 47150, rate: 0.12 },
  { min: 47151, max: 100525, rate: 0.22 },
  { min: 100526, max: 191950, rate: 0.24 },
  { min: 191951, max: 243725, rate: 0.32 },
  { min: 243726, max: 609350, rate: 0.35 },
  { min: 609351, max: null, rate: 0.37 },
];

export const US_SALARY_COMPONENTS: SalaryComponent[] = [
  { name: 'Base Salary', type: SalaryComponentType.PERCENTAGE_OF_CTC, value: 85, isTaxable: true },
  { name: 'Bonus & Allowances', type: SalaryComponentType.BALANCING_FIGURE, value: 0, isTaxable: true },
];

export function getUsTaxRules(financialYear: string, regime: string): TaxRules {
  return {
    countryCode: 'US',
    financialYear,
    regime,
    standardDeduction: 14600,
    rebateLimit: 0,
    rebateAmount: 0,
    cessRate: 0,
    slabs: US_FEDERAL_SLABS,
    deductionLimits: {},
  };
}
