import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ConfigService } from './config.service';
import { TaxRegime } from '../../common/enums/tax-regime.enum';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('countries')
  getCountries() {
    return this.configService.getSupportedCountries();
  }

  @Get('tax-rules')
  getTaxRules(
    @Query('country_code') countryCode: string,
    @Query('financial_year') financialYear: string,
    @Query('regime') regime?: string,
  ) {
    if (!countryCode || !financialYear) {
      throw new BadRequestException('country_code and financial_year are required');
    }
    return this.configService.getTaxRules(
      countryCode,
      financialYear,
      (regime as TaxRegime) ?? TaxRegime.NEW,
    );
  }
}
