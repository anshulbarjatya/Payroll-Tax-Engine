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
  getUkTaxRules,
  UK_SALARY_COMPONENTS,
  UK_STATUTORY,
} from './uk.rules';

@Injectable()
export class UkPayrollStrategy implements CountryPayrollStrategy {
  readonly countryCode = CountryCode.UK;

  constructor(private readonly slabTax: SlabTaxCalculator) {}

  getDefaultSalaryComponents(): SalaryComponent[] {
    return UK_SALARY_COMPONENTS;
  }

  supportsRegimeComparison(): boolean {
    return false;
  }

  getTaxRules(financialYear: string, regime: string): TaxRules {
    return getUkTaxRules(financialYear, regime);
  }

  getStatutoryConfig(): Record<string, unknown> {
    return { ...UK_STATUTORY };
  }

  calculateStatutory(ctx: PayrollCalculationContext): StatutoryLine[] {
    const { grossAnnual, grossMonthly } = ctx.salary;
    const annual = grossAnnual;

    let niEmployee = 0;
    if (annual > UK_STATUTORY.niPrimaryThreshold) {
      const mainBand = Math.min(
        annual,
        UK_STATUTORY.niUpperEarningsLimit,
      ) - UK_STATUTORY.niPrimaryThreshold;
      niEmployee += mainBand * UK_STATUTORY.niEmployeeMainRate;
      if (annual > UK_STATUTORY.niUpperEarningsLimit) {
        niEmployee +=
          (annual - UK_STATUTORY.niUpperEarningsLimit) *
          UK_STATUTORY.niEmployeeUpperRate;
      }
    }

    let niEmployer = 0;
    if (annual > UK_STATUTORY.niSecondaryThreshold) {
      niEmployer =
        (annual - UK_STATUTORY.niSecondaryThreshold) * UK_STATUTORY.niEmployerRate;
    }

    const pensionBase = Math.max(0, annual - UK_STATUTORY.pensionQualifyingThreshold);
    const pensionEmployee = Math.round(
      (pensionBase / 12) * UK_STATUTORY.pensionEmployeeRate,
    );
    const pensionEmployer = Math.round(
      (pensionBase / 12) * UK_STATUTORY.pensionEmployerRate,
    );

    return [
      {
        code: 'NI',
        name: 'National Insurance',
        employeeAmount: Math.round(niEmployee / 12),
        employerAmount: Math.round(niEmployer / 12),
      },
      {
        code: 'PENSION',
        name: 'Auto-Enrolment Pension',
        employeeAmount: pensionEmployee,
        employerAmount: pensionEmployer,
      },
    ];
  }

  calculateTax(ctx: PayrollCalculationContext): TaxResult {
    const rules = getUkTaxRules(ctx.financialYear, ctx.taxRegime);
    return this.slabTax.compute({
      annualGross: ctx.salary.grossAnnual,
      slabs: rules.slabs,
      standardDeduction: rules.standardDeduction,
      cessRate: 0,
    });
  }
}
