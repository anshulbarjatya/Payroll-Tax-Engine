import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { PayslipService } from './payslip.service';

@Controller('reports')
export class PayslipController {
  constructor(private readonly payslipService: PayslipService) {}

  @Get('payslip/:employeeId')
  generatePayslip(
    @Param('employeeId') employeeId: string,
    @Query('month') month: string,
    @Query('financial_year') financialYear: string,
  ) {
    const monthNum = Number(month);
    if (!month || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new BadRequestException('Valid month (1-12) is required');
    }
    if (!financialYear) {
      throw new BadRequestException('financial_year is required');
    }
    return this.payslipService.generatePayslip(employeeId, monthNum, financialYear);
  }

  @Get('form16/:employeeId')
  getForm16(
    @Param('employeeId') employeeId: string,
    @Query('financial_year') financialYear: string,
  ) {
    if (!financialYear) {
      throw new BadRequestException('financial_year is required');
    }
    return this.payslipService.getForm16Data(employeeId, financialYear);
  }

  @Get('payroll-summary')
  payrollSummary(@Query('financial_year') financialYear: string) {
    if (!financialYear) {
      throw new BadRequestException('financial_year is required');
    }
    return this.payslipService.payrollSummaryReport(financialYear);
  }

  @Get('statutory-compliance')
  statutoryCompliance(@Query('financial_year') financialYear: string) {
    if (!financialYear) {
      throw new BadRequestException('financial_year is required');
    }
    return this.payslipService.statutoryComplianceReport(financialYear);
  }
}
