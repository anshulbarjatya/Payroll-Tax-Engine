import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from './modules/config/config.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { SalaryStructureModule } from './modules/salary-structure/salary-structure.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { TaxModule } from './modules/tax/tax.module';
import { StatutoryModule } from './modules/statutory/statutory.module';
import { PayslipModule } from './modules/payslip/payslip.module';
import { DeclarationsModule } from './modules/declarations/declarations.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    CommonModule,
    CoreModule,
    HealthModule,
    ConfigModule,
    EmployeeModule,
    SalaryStructureModule,
    DeclarationsModule,
    PayrollModule,
    TaxModule,
    StatutoryModule,
    PayslipModule,
    AuditModule,
  ],
})
export class AppModule {}
