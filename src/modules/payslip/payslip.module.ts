import { Module } from '@nestjs/common';
import { PayslipController } from './payslip.controller';
import { PayslipService } from './payslip.service';
import { EmployeeModule } from '../employee/employee.module';
import { DeclarationsModule } from '../declarations/declarations.module';
import { SalaryStructureModule } from '../salary-structure/salary-structure.module';

@Module({
  imports: [EmployeeModule, DeclarationsModule, SalaryStructureModule],
  controllers: [PayslipController],
  providers: [PayslipService],
})
export class PayslipModule {}
