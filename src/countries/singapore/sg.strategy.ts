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
  getSgTaxRules,
  SG_SALARY_COMPONENTS,
  SG_STATUTORY,
} from './sg.rules';

@Injectable()
export class SingaporePayrollStrategy implements CountryPayrollStrategy {
  readonly countryCode = CountryCode.SG;

  constructor(private readonly slabTax: SlabTaxCalculator) {}

  getDefaultSalaryComponents(): SalaryComponent[] {
    return SG_SALARY_COMPONENTS;
  }

  supportsRegimeComparison(): boolean {
    return false;
  }

  getTaxRules(financialYear: string, regime: string): TaxRules {
    return getSgTaxRules(financialYear, regime);
  }

  getStatutoryConfig(): Record<string, unknown> {
    return { ...SG_STATUTORY };
  }

  calculateStatutory(ctx: PayrollCalculationContext): StatutoryLine[] {
    const { grossMonthly } = ctx.salary;
    const cpfBase = Math.min(grossMonthly, SG_STATUTORY.cpfOrdinaryWageCeiling);
    const cpfEmployee = Math.round(cpfBase * SG_STATUTORY.cpfEmployeeRate);
    const cpfEmployer = Math.round(cpfBase * SG_STATUTORY.cpfEmployerRate);

    let sdl = Math.round(grossMonthly * SG_STATUTORY.sdlRate * 100) / 100;
    sdl = Math.max(SG_STATUTORY.sdlMin, Math.min(SG_STATUTORY.sdlMax, sdl));

    return [
      {
        code: 'CPF',
        name: 'Central Provident Fund (CPF)',
        employeeAmount: cpfEmployee,
        employerAmount: cpfEmployer,
      },
      {
        code: 'SDL',
        name: 'Skills Development Levy (SDL)',
        employeeAmount: 0,
        employerAmount: Math.round(sdl),
      },
    ];
  }

  calculateTax(ctx: PayrollCalculationContext): TaxResult {
    const rules = getSgTaxRules(ctx.financialYear, ctx.taxRegime);
    return this.slabTax.compute({
      annualGross: ctx.salary.grossAnnual,
      slabs: rules.slabs,
      standardDeduction: 0,
      cessRate: 0,
    });
  }
}
