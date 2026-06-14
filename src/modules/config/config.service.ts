import { Injectable } from '@nestjs/common';
import { TaxRegime } from '../../common/enums/tax-regime.enum';
import { CountryRegistryService } from '../../core/country-registry.service';

@Injectable()
export class ConfigService {
  constructor(private readonly countryRegistry: CountryRegistryService) {}

  getSupportedCountries() {
    return { countries: this.countryRegistry.getSupportedCountries() };
  }

  getTaxRules(countryCode: string, financialYear: string, regime: string) {
    return this.countryRegistry.getTaxRules(
      countryCode,
      financialYear,
      regime || TaxRegime.NEW,
    );
  }
}
