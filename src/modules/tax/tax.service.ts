import { Injectable, BadRequestException } from '@nestjs/common';
import { CountryRegistryService } from '../../core/country-registry.service';
import {
  AnnualProjectionDto,
  ComputeIncomeTaxDto,
  ComputeTdsDto,
} from './dto/tax.dto';

@Injectable()
export class TaxService {
  constructor(private readonly countryRegistry: CountryRegistryService) {}

  computeIncomeTax(dto: ComputeIncomeTaxDto) {
    const strategy = this.countryRegistry.getStrategy(dto.countryCode);
    const salary = {
      ctc: dto.annualGross,
      monthlyCtc: Math.round(dto.annualGross / 12),
      components: [],
      grossMonthly: Math.round(dto.annualGross / 12),
      grossAnnual: dto.annualGross,
      basicMonthly: Math.round(dto.annualGross / 12) * 0.4,
      basicAnnual: dto.annualGross * 0.4,
    };
    return strategy.calculateTax({
      countryCode: dto.countryCode,
      financialYear: dto.financialYear,
      taxRegime: dto.taxRegime,
      ctc: dto.annualGross,
      salary,
      declarations: dto,
    });
  }

  getTaxSlabs(countryCode: string, financialYear: string, regime: string) {
    const rules = this.countryRegistry.getTaxRules(countryCode, financialYear, regime);
    return {
      countryCode,
      financialYear,
      regime,
      slabs: rules.slabs,
      standardDeduction: rules.standardDeduction,
      rebateLimit: rules.rebateLimit,
      rebateAmount: rules.rebateAmount,
      cessRate: rules.cessRate,
    };
  }

  computeMonthlyTds(dto: ComputeTdsDto) {
    const result = this.computeIncomeTax(dto);
    const month = dto.month ?? new Date().getMonth() + 1;
    return {
      month,
      annualTax: result.totalTax,
      monthlyTds: result.monthlyWithholding,
      remainingMonths: 12 - month + 1,
      taxDetails: result,
    };
  }

  annualProjection(dto: AnnualProjectionDto) {
    const result = this.computeIncomeTax(dto);
    return {
      financialYear: dto.financialYear,
      taxRegime: dto.taxRegime,
      annualGross: dto.annualGross,
      projection: {
        taxableIncome: result.taxableIncome,
        totalTax: result.totalTax,
        monthlyTds: result.monthlyWithholding,
        effectiveTaxRate:
          dto.annualGross > 0
            ? Math.round((result.totalTax / dto.annualGross) * 10000) / 100
            : 0,
      },
      breakdown: result,
    };
  }
}
