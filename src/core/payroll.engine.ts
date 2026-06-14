import { Injectable, BadRequestException } from '@nestjs/common';
import { TaxRegime } from '../common/enums/tax-regime.enum';
import {
  PayrollBreakdown,
  PayrollComponent,
} from '../common/interfaces/payroll-breakdown.interface';
import { SalaryCalculator } from './calculators/salary.calculator';
import { CountryRegistryService } from './country-registry.service';
import { PayrollEngineInput } from './interfaces/country-payroll.strategy.interface';

@Injectable()
export class PayrollEngine {
  constructor(
    private readonly registry: CountryRegistryService,
    private readonly salaryCalculator: SalaryCalculator,
  ) {}

  calculate(input: PayrollEngineInput): PayrollBreakdown {
    if (input.ctc <= 0) {
      throw new BadRequestException('CTC must be greater than zero');
    }

    const strategy = this.registry.getStrategy(input.countryCode);
    const components =
      input.salaryComponents ?? strategy.getDefaultSalaryComponents();
    const salary = this.salaryCalculator.breakdown(input.ctc, components);

    const ctx = {
      countryCode: input.countryCode,
      financialYear: input.financialYear,
      taxRegime: input.taxRegime,
      ctc: input.ctc,
      state: input.state,
      salary,
      declarations: input.declarations,
    };

    const statutoryLines = strategy.calculateStatutory(ctx);
    const taxResult = strategy.calculateTax(ctx);

    const earnings: PayrollComponent[] = salary.components.map((c) => ({
      name: c.name,
      amount: c.monthly,
      type: 'earning',
      category: c.isTaxable ? 'taxable' : 'exempt',
    }));

    const employeeDeductions: PayrollComponent[] = [
      ...statutoryLines
        .filter((l) => l.employeeAmount > 0)
        .map((l) => ({
          name: l.name,
          amount: l.employeeAmount,
          type: 'deduction' as const,
          category: 'statutory',
        })),
      {
        name: this.withholdingLabel(input.countryCode),
        amount: taxResult.monthlyWithholding,
        type: 'deduction',
        category: 'tax',
      },
    ];

    const employerContributions: PayrollComponent[] = statutoryLines.flatMap(
      (l) => {
        if (l.employerBreakdown?.length) {
          return l.employerBreakdown.map((b) => ({
            name: b.name,
            amount: b.amount,
            type: 'employer_contribution' as const,
            category: 'statutory',
          }));
        }
        if (l.employerAmount > 0) {
          return [
            {
              name: `${l.name} (Employer)`,
              amount: l.employerAmount,
              type: 'employer_contribution' as const,
              category: 'statutory',
            },
          ];
        }
        return [];
      },
    );

    const totalEmployeeStatutory = statutoryLines.reduce(
      (s, l) => s + l.employeeAmount,
      0,
    );
    const totalEmployerStatutory = employerContributions.reduce(
      (s, c) => s + c.amount,
      0,
    );
    const totalDeductions = employeeDeductions.reduce((s, d) => s + d.amount, 0);
    const netPay = salary.grossMonthly - totalDeductions;
    const totalEmployerCost = salary.grossMonthly + totalEmployerStatutory;

    return {
      employeeId: input.employeeId,
      countryCode: input.countryCode,
      financialYear: input.financialYear,
      taxRegime: input.taxRegime,
      ctc: input.ctc,
      grossSalary: salary.grossMonthly,
      earnings,
      employeeDeductions,
      employerContributions,
      netPay,
      totalEmployerCost,
      employerCostSummary: {
        grossSalary: salary.grossMonthly,
        totalEmployerContributions: totalEmployerStatutory,
        totalCostToCompany: totalEmployerCost,
        employerContributionBreakdown: employerContributions,
      },
      taxDetails: {
        taxableIncome: taxResult.taxableIncome,
        incomeTax: taxResult.incomeTax,
        surcharge: taxResult.surcharge,
        cess: taxResult.cess,
        totalTax: taxResult.totalTax,
        monthlyTds: taxResult.monthlyWithholding,
      },
      calculatedAt: new Date().toISOString(),
    };
  }

  compareRegimes(input: Omit<PayrollEngineInput, 'taxRegime'>) {
    const strategy = this.registry.getStrategy(input.countryCode);
    if (!strategy.supportsRegimeComparison()) {
      throw new BadRequestException(
        `Regime comparison is not supported for country: ${input.countryCode}`,
      );
    }
    const oldRegime = this.calculate({ ...input, taxRegime: TaxRegime.OLD });
    const newRegime = this.calculate({ ...input, taxRegime: TaxRegime.NEW });
    const recommended =
      newRegime.netPay >= oldRegime.netPay ? TaxRegime.NEW : TaxRegime.OLD;

    return {
      oldRegime,
      newRegime,
      recommended,
      netPayDifference: Math.abs(newRegime.netPay - oldRegime.netPay),
      annualTaxSavings:
        recommended === TaxRegime.NEW
          ? oldRegime.taxDetails.totalTax - newRegime.taxDetails.totalTax
          : newRegime.taxDetails.totalTax - oldRegime.taxDetails.totalTax,
    };
  }

  private withholdingLabel(countryCode: string): string {
    const labels: Record<string, string> = {
      IN: 'TDS (Income Tax)',
      US: 'Federal Income Tax Withholding',
      UK: 'PAYE (Income Tax)',
      SG: 'Income Tax Deduction',
    };
    return labels[countryCode] ?? 'Income Tax Withholding';
  }
}
