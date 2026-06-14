import { Module, forwardRef } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { EmployeeModule } from '../employee/employee.module';
import { SalaryStructureModule } from '../salary-structure/salary-structure.module';
import { DeclarationsModule } from '../declarations/declarations.module';

@Module({
  imports: [
    EmployeeModule,
    SalaryStructureModule,
    forwardRef(() => DeclarationsModule),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
