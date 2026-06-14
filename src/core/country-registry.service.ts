import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { CountryCode } from '../common/enums/country-code.enum';
import { CountryPayrollStrategy } from './interfaces/country-payroll.strategy.interface';
import { IndiaPayrollStrategy } from '../countries/india/india.strategy';
import { UsPayrollStrategy } from '../countries/us/us.strategy';
import { UkPayrollStrategy } from '../countries/uk/uk.strategy';
import { SingaporePayrollStrategy } from '../countries/singapore/sg.strategy';

export interface CountryMeta {
  code: CountryCode;
  name: string;
  currency: string;
  supportedFinancialYears: string[];
  supportedRegimes: string[];
  statutorySchemes: string[];
}

@Injectable()
export class CountryRegistryService implements OnModuleInit {
  private strategies = new Map<string, CountryPayrollStrategy>();

  constructor(
    private readonly india: IndiaPayrollStrategy,
    private readonly us: UsPayrollStrategy,
    private readonly uk: UkPayrollStrategy,
    private readonly singapore: SingaporePayrollStrategy,
  ) {}

  onModuleInit(): void {
    [this.india, this.us, this.uk, this.singapore].forEach((s) =>
      this.strategies.set(s.countryCode, s),
    );
  }

  getStrategy(countryCode: string): CountryPayrollStrategy {
    const strategy = this.strategies.get(countryCode.toUpperCase());
    if (!strategy) {
      throw new BadRequestException(`Unsupported country: ${countryCode}`);
    }
    return strategy;
  }

  getSupportedCountries(): CountryMeta[] {
    return [
      {
        code: CountryCode.IN,
        name: 'India',
        currency: 'INR',
        supportedFinancialYears: ['2025-26'],
        supportedRegimes: ['old', 'new'],
        statutorySchemes: ['EPF', 'EPS', 'EDLI', 'ESI', 'Professional Tax', 'Gratuity'],
      },
      {
        code: CountryCode.US,
        name: 'United States',
        currency: 'USD',
        supportedFinancialYears: ['2025'],
        supportedRegimes: ['standard'],
        statutorySchemes: ['Social Security', 'Medicare', 'FUTA'],
      },
      {
        code: CountryCode.UK,
        name: 'United Kingdom',
        currency: 'GBP',
        supportedFinancialYears: ['2025-26'],
        supportedRegimes: ['standard'],
        statutorySchemes: ['National Insurance', 'Auto-Enrolment Pension'],
      },
      {
        code: CountryCode.SG,
        name: 'Singapore',
        currency: 'SGD',
        supportedFinancialYears: ['2025'],
        supportedRegimes: ['standard'],
        statutorySchemes: ['CPF (Central Provident Fund)', 'SDL'],
      },
    ];
  }

  getTaxRules(countryCode: string, financialYear: string, regime: string) {
    const strategy = this.getStrategy(countryCode);
    return {
      ...strategy.getTaxRules(financialYear, regime),
      statutoryLimits: strategy.getStatutoryConfig(),
    };
  }
}
