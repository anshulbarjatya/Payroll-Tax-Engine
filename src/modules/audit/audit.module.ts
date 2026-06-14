import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditComplianceService } from './audit-compliance.service';

@Module({
  controllers: [AuditController],
  providers: [AuditComplianceService],
})
export class AuditModule {}
