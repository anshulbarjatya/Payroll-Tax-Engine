import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuditComplianceService } from './audit-compliance.service';
import { ValidatePanDto } from './dto/audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditComplianceService: AuditComplianceService) {}

  @Get('trail')
  getAuditTrail(
    @Query('entity_id') entityId?: string,
    @Query('entity_type') entityType?: string,
  ) {
    return this.auditComplianceService.getAuditTrail(entityId, entityType);
  }

  @Post('validate-pan')
  validatePan(@Body() dto: ValidatePanDto) {
    return this.auditComplianceService.validatePan(dto);
  }

  @Get('compliance/:employeeId')
  checkCompliance(
    @Param('employeeId') employeeId: string,
    @Query('financial_year') financialYear: string,
  ) {
    return this.auditComplianceService.checkCompliance(
      employeeId,
      financialYear ?? '2025-26',
    );
  }
}
