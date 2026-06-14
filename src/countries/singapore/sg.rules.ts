import { SalaryComponentType } from '../../common/enums/salary-component-type.enum';
import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { TaxRules } from '../../common/interfaces/tax-slab.interface';

export const SG_STATUTORY = {
  cpfOrdinaryWageCeiling: 7400,
  cpfEmployeeRate: 0.2,
  cpfEmployerRate: 0.17,
  sdlRate: 0.0025,
  sdlMin: 2,
  sdlMax: 11.25,
};

export const SG_TAX_SLABS = [
  { min: 0, max: 20000, rate: 0 },
  { min: 20001, max: 30000, rate: 0.02 },
  { min: 30001, max: 40000, rate: 0.035 },
  { min: 40001, max: 80000, rate: 0.07 },
  { min: 80001, max: 120000, rate: 0.115 },
  { min: 120001, max: 160000, rate: 0.15 },
  { min: 160001, max: 200000, rate: 0.18 },
  { min: 200001, max: 320000, rate: 0.19 },
  { min: 320001, max: 500000, rate: 0.195 },
  { min: 500001, max: null, rate: 0.22 },
];

export const SG_SALARY_COMPONENTS: SalaryComponent[] = [
  { name: 'Basic Salary', type: SalaryComponentType.PERCENTAGE_OF_CTC, value: 75, isTaxable: true },
  { name: 'Allowances', type: SalaryComponentType.BALANCING_FIGURE, value: 0, isTaxable: true },
];

export function getSgTaxRules(financialYear: string, regime: string): TaxRules {
  return {
    countryCode: 'SG',
    financialYear,
    regime,
    standardDeduction: 0,
    rebateLimit: 0,
    rebateAmount: 0,
    cessRate: 0,
    slabs: SG_TAX_SLABS,
    deductionLimits: {},
  };
}
