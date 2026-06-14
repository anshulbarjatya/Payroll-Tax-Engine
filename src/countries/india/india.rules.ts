import { TaxRegime } from '../../common/enums/tax-regime.enum';
import { SalaryComponentType } from '../../common/enums/salary-component-type.enum';
import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { TaxRules } from '../../common/interfaces/tax-slab.interface';

export const INDIA_STATUTORY = {
  pfWageCeiling: 15000,
  pfEmployeeRate: 0.12,
  pfEmployerRate: 0.12,
  epsRate: 0.0833,
  edliRate: 0.005,
  esiWageCeiling: 21000,
  esiEmployeeRate: 0.0075,
  esiEmployerRate: 0.0325,
  gratuityRate: 0.0481,
  section80cLimit: 150000,
  section80dLimit: 25000,
  section80ccd1bLimit: 50000,
  rebate87aLimit: 700000,
  rebate87aAmount: 25000,
};

export const INDIA_NEW_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 0.05 },
  { min: 800001, max: 1200000, rate: 0.1 },
  { min: 1200001, max: 1600000, rate: 0.15 },
  { min: 1600001, max: 2000000, rate: 0.2 },
  { min: 2000001, max: 2400000, rate: 0.25 },
  { min: 2400001, max: null, rate: 0.3 },
];

export const INDIA_OLD_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.2 },
  { min: 1000001, max: null, rate: 0.3 },
];

export const PROFESSIONAL_TAX_BY_STATE: Record<string, number> = {
  MH: 2500, KA: 2400, TN: 2500, DL: 0, TS: 2500, WB: 2500, GJ: 2500,
};

export const INDIA_SALARY_COMPONENTS: SalaryComponent[] = [
  { name: 'Basic', type: SalaryComponentType.PERCENTAGE_OF_CTC, value: 40, isTaxable: true },
  { name: 'HRA', type: SalaryComponentType.PERCENTAGE_OF_BASIC, value: 50, isTaxable: false },
  { name: 'Special Allowance', type: SalaryComponentType.BALANCING_FIGURE, value: 0, isTaxable: true },
];

export function getIndiaTaxRules(financialYear: string, regime: string): TaxRules {
  const isNew = regime !== TaxRegime.OLD;
  return {
    countryCode: 'IN',
    financialYear,
    regime,
    standardDeduction: isNew ? 75000 : 50000,
    rebateLimit: INDIA_STATUTORY.rebate87aLimit,
    rebateAmount: isNew ? INDIA_STATUTORY.rebate87aAmount : 12500,
    cessRate: 0.04,
    slabs: isNew ? INDIA_NEW_SLABS : INDIA_OLD_SLABS,
    deductionLimits: {
      section80c: INDIA_STATUTORY.section80cLimit,
      section80d: INDIA_STATUTORY.section80dLimit,
      section80ccd1b: INDIA_STATUTORY.section80ccd1bLimit,
    },
  };
}
