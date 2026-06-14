import { Body, Controller, Post } from '@nestjs/common';
import { StatutoryService } from './statutory.service';
import { StatutoryContributionsDto } from './dto/statutory.dto';

@Controller('statutory')
export class StatutoryController {
  constructor(private readonly statutoryService: StatutoryService) {}

  @Post('contributions')
  calculateContributions(@Body() dto: StatutoryContributionsDto) {
    return this.statutoryService.calculateContributions(dto);
  }

  @Post('pf')
  calculatePf(@Body() dto: { basicMonthly: number }) {
    return this.statutoryService.calculatePf(dto);
  }

  @Post('esi')
  calculateEsi(@Body() dto: { grossMonthly: number }) {
    return this.statutoryService.calculateEsi(dto);
  }

  @Post('professional-tax')
  calculateProfessionalTax(@Body() dto: { state: string; annualGross: number }) {
    return this.statutoryService.calculateProfessionalTax(dto);
  }

  @Post('gratuity')
  calculateGratuity(@Body() dto: { basicMonthly: number; yearsOfService?: number }) {
    return this.statutoryService.calculateGratuity(dto);
  }
}
