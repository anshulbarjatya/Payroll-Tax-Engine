import { Injectable } from '@nestjs/common';
import { TaxRegime } from '../../common/enums/tax-regime.enum';
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
  getIndiaTaxRules,
  INDIA_SALARY_COMPONENTS,
  INDIA_STATUTORY,
  PROFESSIONAL_TAX_BY_STATE,
} from './india.rules';

@Injectable()
export class IndiaPayrollStrategy implements CountryPayrollStrategy {
  readonly countryCode = CountryCode.IN;

  constructor(private readonly slabTax: SlabTaxCalculator) {}

  getDefaultSalaryComponents(): SalaryComponent[] {
    return INDIA_SALARY_COMPONENTS;
  }

  supportsRegimeComparison(): boolean {
    return true;
  }

  getTaxRules(financialYear: string, regime: string): TaxRules {
    return getIndiaTaxRules(financialYear, regime);
  }

  getStatutoryConfig(): Record<string, unknown> {
    return { ...INDIA_STATUTORY, professionalTaxByState: PROFESSIONAL_TAX_BY_STATE };
  }

  calculateStatutory(ctx: PayrollCalculationContext): StatutoryLine[] {
    const { basicMonthly, grossMonthly, grossAnnual } = ctx.salary;
    const lines: StatutoryLine[] = [];

    const pfBase = Math.min(basicMonthly, INDIA_STATUTORY.pfWageCeiling);
    const pfEmployee = Math.round(pfBase * INDIA_STATUTORY.pfEmployeeRate);
    const pfEmployerTotal = Math.round(pfBase * INDIA_STATUTORY.pfEmployerRate);
    const eps = Math.round(pfBase * INDIA_STATUTORY.epsRate);
    const edli = Math.round(pfBase * INDIA_STATUTORY.edliRate);

    lines.push({
      code: 'EPF',
      name: 'Provident Fund (EPF)',
      employeeAmount: pfEmployee,
      employerAmount: pfEmployerTotal,
      employerBreakdown: [
        { name: 'EPF (Employer EPF share)', amount: pfEmployerTotal - eps },
        { name: 'EPS (Employer)', amount: eps },
        { name: 'EDLI (Employer)', amount: edli },
      ],
    });

    if (grossMonthly <= INDIA_STATUTORY.esiWageCeiling) {
      lines.push({
        code: 'ESI',
        name: 'Employee State Insurance (ESI)',
        employeeAmount: Math.round(grossMonthly * INDIA_STATUTORY.esiEmployeeRate),
        employerAmount: Math.round(grossMonthly * INDIA_STATUTORY.esiEmployerRate),
      });
    }

    const ptAnnual = PROFESSIONAL_TAX_BY_STATE[ctx.state ?? ''] ?? 0;
    const ptMonthly =
      ptAnnual > 0 && grossAnnual >= 120000 ? Math.round(ptAnnual / 12) : 0;
    if (ptMonthly > 0) {
      lines.push({
        code: 'PT',
        name: 'Professional Tax',
        employeeAmount: ptMonthly,
        employerAmount: 0,
      });
    }

    lines.push({
      code: 'GRATUITY',
      name: 'Gratuity Provision',
      employeeAmount: 0,
      employerAmount: Math.round(basicMonthly * INDIA_STATUTORY.gratuityRate),
    });

    return lines;
  }

  calculateTax(ctx: PayrollCalculationContext): TaxResult {
    const rules = getIndiaTaxRules(ctx.financialYear, ctx.taxRegime);
    const extra: Record<string, number> = {};

    if (ctx.taxRegime === TaxRegime.OLD && ctx.declarations) {
      extra.section80c = Math.min(
        ctx.declarations.section80c ?? 0,
        rules.deductionLimits.section80c,
      );
      extra.section80d = Math.min(
        ctx.declarations.section80d ?? 0,
        rules.deductionLimits.section80d,
      );
      extra.section80ccd1b = Math.min(
        ctx.declarations.section80ccd1b ?? 0,
        rules.deductionLimits.section80ccd1b,
      );
      extra.hraExemption = ctx.declarations.hraExemption ?? 0;
      extra.ltaExemption = ctx.declarations.ltaExemption ?? 0;
      extra.section24b = ctx.declarations.section24b ?? 0;
    }

    return this.slabTax.compute({
      annualGross: ctx.salary.grossAnnual,
      slabs: rules.slabs,
      standardDeduction: rules.standardDeduction,
      extraDeductions: extra,
      rebateLimit: rules.rebateLimit,
      rebateAmount: rules.rebateAmount,
      cessRate: rules.cessRate,
      applyRebate: (taxable: number, tax: number) => {
        if (ctx.taxRegime === TaxRegime.OLD && taxable <= 500000) {
          return Math.min(tax, 12500);
        }
        if (ctx.taxRegime === TaxRegime.NEW && taxable <= rules.rebateLimit) {
          return Math.min(tax, rules.rebateAmount);
        }
        return 0;
      },
    });
  }
}
