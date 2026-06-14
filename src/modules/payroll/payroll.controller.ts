import { Body, Controller, Post } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import {
  BulkPayrollDto,
  CalculatePayrollDto,
  CompareRegimesDto,
  QuickCtcDto,
} from './dto/payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('calculate')
  calculateFull(@Body() dto: CalculatePayrollDto) {
    return this.payrollService.calculateFull(dto);
  }

  @Post('quick-ctc')
  quickCtc(@Body() dto: QuickCtcDto) {
    return this.payrollService.quickCtc(dto);
  }

  @Post('compare-regimes')
  compareRegimes(@Body() dto: CompareRegimesDto) {
    return this.payrollService.compareRegimes(dto);
  }

  @Post('bulk')
  bulkRun(@Body() dto: BulkPayrollDto) {
    return this.payrollService.bulkRun(dto);
  }
}
