import { Injectable } from '@nestjs/common';
import { CountryRegistryService } from '../../core/country-registry.service';
import { StatutoryContributionsDto } from './dto/statutory.dto';

@Injectable()
export class StatutoryService {
  constructor(private readonly countryRegistry: CountryRegistryService) {}

  calculateContributions(dto: StatutoryContributionsDto) {
    const strategy = this.countryRegistry.getStrategy(dto.countryCode);
    const basicMonthly = dto.basicMonthly ?? Math.round(dto.grossMonthly * 0.4);
    const salary = {
      ctc: dto.grossMonthly * 12,
      monthlyCtc: dto.grossMonthly,
      components: [],
      grossMonthly: dto.grossMonthly,
      grossAnnual: dto.grossMonthly * 12,
      basicMonthly,
      basicAnnual: basicMonthly * 12,
    };

    const lines = strategy.calculateStatutory({
      countryCode: dto.countryCode,
      financialYear: dto.financialYear,
      taxRegime: 'standard',
      ctc: salary.ctc,
      state: dto.state,
      salary,
    });

    const totalEmployee = lines.reduce((s, l) => s + l.employeeAmount, 0);
    const totalEmployer = lines.reduce((s, l) => s + l.employerAmount, 0);

    return {
      countryCode: dto.countryCode,
      financialYear: dto.financialYear,
      grossMonthly: dto.grossMonthly,
      contributions: lines,
      summary: {
        totalEmployeeContributions: totalEmployee,
        totalEmployerContributions: totalEmployer,
        totalStatutoryCost: totalEmployee + totalEmployer,
      },
      statutoryConfig: strategy.getStatutoryConfig(),
    };
  }

  /** India-specific: PF calculation (backward compatible). */
  calculatePf(dto: { basicMonthly: number }) {
    const strategy = this.countryRegistry.getStrategy('IN');
    const config = strategy.getStatutoryConfig() as {
      pfWageCeiling: number;
      pfEmployeeRate: number;
      pfEmployerRate: number;
      epsRate: number;
      edliRate: number;
    };
    const pfBase = Math.min(dto.basicMonthly, config.pfWageCeiling);
    const employeeContribution = Math.round(pfBase * config.pfEmployeeRate);
    const employerTotal = Math.round(pfBase * config.pfEmployerRate);
    const eps = Math.round(pfBase * config.epsRate);
    const edli = Math.round(pfBase * config.edliRate);
    return {
      wageBase: pfBase,
      employeeContribution,
      employerContribution: employerTotal,
      breakdown: { eps, epfEmployer: employerTotal - eps, edli },
      pfWageCeiling: config.pfWageCeiling,
      rates: {
        employee: config.pfEmployeeRate,
        employer: config.pfEmployerRate,
        eps: config.epsRate,
        edli: config.edliRate,
      },
    };
  }

  calculateEsi(dto: { grossMonthly: number }) {
    const result = this.calculateContributions({
      countryCode: 'IN' as never,
      financialYear: '2025-26',
      grossMonthly: dto.grossMonthly,
    });
    return result.contributions.find((c) => c.code === 'ESI') ?? { applicable: false };
  }

  calculateProfessionalTax(dto: { state: string; annualGross: number }) {
    const result = this.calculateContributions({
      countryCode: 'IN' as never,
      financialYear: '2025-26',
      grossMonthly: Math.round(dto.annualGross / 12),
      state: dto.state,
    });
    const pt = result.contributions.find((c) => c.code === 'PT');
    return {
      state: dto.state,
      annualGross: dto.annualGross,
      annualProfessionalTax: (pt?.employeeAmount ?? 0) * 12,
      monthlyProfessionalTax: pt?.employeeAmount ?? 0,
    };
  }

  calculateGratuity(dto: { basicMonthly: number; yearsOfService?: number }) {
    const result = this.calculateContributions({
      countryCode: 'IN' as never,
      financialYear: '2025-26',
      grossMonthly: dto.basicMonthly / 0.4,
      basicMonthly: dto.basicMonthly,
    });
    const gratuity = result.contributions.find((c) => c.code === 'GRATUITY');
    const years = dto.yearsOfService ?? 0;
    return {
      basicMonthly: dto.basicMonthly,
      monthlyProvision: gratuity?.employerAmount ?? 0,
      yearsOfService: years,
      estimatedPayout:
        years >= 5 ? Math.round((15 * dto.basicMonthly * years) / 26) : 0,
    };
  }
}
