import { Injectable } from '@nestjs/common';
import { TaxSlab } from '../../common/interfaces/tax-slab.interface';
import { TaxResult } from '../interfaces/country-payroll.strategy.interface';

@Injectable()
export class SlabTaxCalculator {
  applySlabs(
    taxableIncome: number,
    slabs: TaxSlab[],
  ): { slab: string; taxableAmount: number; tax: number }[] {
    return slabs
      .map((slab) => {
        if (taxableIncome <= slab.min) return null;
        const ceiling = slab.max ?? taxableIncome;
        const floor = slab.min === 0 ? 0 : slab.min - 1;
        const taxableAmount = Math.max(0, Math.min(taxableIncome, ceiling) - floor);
        if (taxableAmount <= 0) return null;
        const tax = Math.round(taxableAmount * slab.rate);
        const label = slab.max === null ? `Above ${slab.min}` : `${slab.min} - ${slab.max}`;
        return { slab: label, taxableAmount, tax };
      })
      .filter((s): s is { slab: string; taxableAmount: number; tax: number } => s !== null);
  }

  compute(params: {
    annualGross: number;
    slabs: TaxSlab[];
    standardDeduction: number;
    extraDeductions?: Record<string, number>;
    rebateLimit?: number;
    rebateAmount?: number;
    surchargeRate?: number;
    cessRate?: number;
    applyRebate?: (taxableIncome: number, incomeTax: number) => number;
  }): TaxResult {
    const deductions: Record<string, number> = {
      standardDeduction: params.standardDeduction,
      ...params.extraDeductions,
    };
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
    const taxableIncome = Math.max(0, params.annualGross - totalDeductions);
    const slabBreakdown = this.applySlabs(taxableIncome, params.slabs);
    let incomeTax = slabBreakdown.reduce((sum, s) => sum + s.tax, 0);
    const surcharge = Math.round(incomeTax * (params.surchargeRate ?? 0));

    let rebate = 0;
    if (params.applyRebate) {
      rebate = params.applyRebate(taxableIncome, incomeTax);
    } else if (params.rebateLimit && params.rebateAmount && taxableIncome <= params.rebateLimit) {
      rebate = Math.min(incomeTax, params.rebateAmount);
    }
    incomeTax = Math.max(0, incomeTax - rebate);

    const cess = Math.round((incomeTax + surcharge) * (params.cessRate ?? 0));
    const totalTax = incomeTax + surcharge + cess;

    return {
      grossTaxableIncome: params.annualGross,
      deductions,
      taxableIncome,
      slabBreakdown,
      incomeTax,
      surcharge,
      cess,
      rebate,
      totalTax,
      monthlyWithholding: Math.round(totalTax / 12),
    };
  }
}
