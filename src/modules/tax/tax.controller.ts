import { Body, Controller, Get, Post, Query, BadRequestException } from '@nestjs/common';
import { TaxService } from './tax.service';
import {
  AnnualProjectionDto,
  ComputeIncomeTaxDto,
  ComputeTdsDto,
} from './dto/tax.dto';
import { TaxRegime } from '../../common/enums/tax-regime.enum';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post('compute-income-tax')
  computeIncomeTax(@Body() dto: ComputeIncomeTaxDto) {
    return this.taxService.computeIncomeTax(dto);
  }

  @Get('slabs')
  getTaxSlabs(
    @Query('country_code') countryCode: string,
    @Query('financial_year') financialYear: string,
    @Query('regime') regime: string,
  ) {
    if (!countryCode || !financialYear || !regime) {
      throw new BadRequestException('country_code, financial_year, and regime are required');
    }
    return this.taxService.getTaxSlabs(
      countryCode,
      financialYear,
      regime as TaxRegime,
    );
  }

  @Post('compute-tds')
  computeMonthlyTds(@Body() dto: ComputeTdsDto) {
    return this.taxService.computeMonthlyTds(dto);
  }

  @Post('annual-projection')
  annualProjection(@Body() dto: AnnualProjectionDto) {
    return this.taxService.annualProjection(dto);
  }
}
