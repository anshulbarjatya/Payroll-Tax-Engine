import { Injectable } from '@nestjs/common';
import { CountryCode } from '../../common/enums/country-code.enum';
import { TaxRules } from '../../common/interfaces/tax-slab.interface';
import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { SlabTaxCalculator } from '../../core/calculators/slab-tax.calculator';
import {
  CountryPayrollStrategy,
  PayrollCalculationContext,
  StatutoryLine,
  TaxResult,
} from '../../core/interfaces/country-payroll.strategy.interface';
import {
  getUsTaxRules,
  US_SALARY_COMPONENTS,
  US_STATUTORY,
} from './us.rules';

@Injectable()
export class UsPayrollStrategy implements CountryPayrollStrategy {
  readonly countryCode = CountryCode.US;

  constructor(private readonly slabTax: SlabTaxCalculator) {}

  getDefaultSalaryComponents(): SalaryComponent[] {
    return US_SALARY_COMPONENTS;
  }

  supportsRegimeComparison(): boolean {
    return false;
  }

  getTaxRules(financialYear: string, regime: string): TaxRules {
    return getUsTaxRules(financialYear, regime);
  }

  getStatutoryConfig(): Record<string, unknown> {
    return { ...US_STATUTORY };
  }

  calculateStatutory(ctx: PayrollCalculationContext): StatutoryLine[] {
    const { grossMonthly, grossAnnual } = ctx.salary;
    const ssBase = Math.min(grossAnnual, US_STATUTORY.socialSecurityWageBase);
    const ssMonthly = Math.round(ssBase / 12);
    const ssEmployee = Math.round(ssMonthly * US_STATUTORY.socialSecurityRate);
    const ssEmployer = ssEmployee;

    const medicareEmployee = Math.round(grossMonthly * US_STATUTORY.medicareRate);
    const medicareEmployer = medicareEmployee;

    const futaBase = Math.min(grossAnnual, US_STATUTORY.futaWageBase);
    const futaEmployer = Math.round((futaBase / 12) * US_STATUTORY.futaRate);

    return [
      {
        code: 'SS',
        name: 'Social Security (FICA)',
        employeeAmount: ssEmployee,
        employerAmount: ssEmployer,
      },
      {
        code: 'MEDICARE',
        name: 'Medicare',
        employeeAmount: medicareEmployee,
        employerAmount: medicareEmployer,
      },
      {
        code: 'FUTA',
        name: 'FUTA (Federal Unemployment)',
        employeeAmount: 0,
        employerAmount: futaEmployer,
      },
    ];
  }

  calculateTax(ctx: PayrollCalculationContext): TaxResult {
    const rules = getUsTaxRules(ctx.financialYear, ctx.taxRegime);
    return this.slabTax.compute({
      annualGross: ctx.salary.grossAnnual,
      slabs: rules.slabs,
      standardDeduction: rules.standardDeduction,
      cessRate: 0,
    });
  }
}
