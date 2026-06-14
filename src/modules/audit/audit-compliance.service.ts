import { Injectable } from '@nestjs/common';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditService } from '../../common/services/audit.service';
import { ValidatePanDto } from './dto/audit.dto';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

@Injectable()
export class AuditComplianceService {
  constructor(private readonly auditService: AuditService) {}

  getAuditTrail(entityId?: string, entityType?: string) {
    return {
      count: this.auditService.getTrail(entityId, entityType).length,
      entries: this.auditService.getTrail(entityId, entityType),
    };
  }

  validatePan(dto: ValidatePanDto) {
    const pan = dto.pan.toUpperCase();
    const valid = PAN_REGEX.test(pan);
    const fourthChar = pan.charAt(3);
    const holderType =
      fourthChar === 'P'
        ? 'Individual'
        : fourthChar === 'C'
          ? 'Company'
          : 'Other';

    this.auditService.log(AuditAction.PAN_VALIDATED, 'pan', pan, { valid });

    return {
      pan,
      valid,
      holderType: valid ? holderType : null,
      message: valid ? 'PAN format is valid' : 'Invalid PAN format',
    };
  }

  checkCompliance(employeeId: string, financialYear: string) {
    const trail = this.auditService.getTrail(employeeId);
    const hasPayrollRun = trail.some(
      (e) => e.action === AuditAction.PAYROLL_CALCULATED,
    );
    const hasDeclaration = trail.some(
      (e) => e.action === AuditAction.DECLARATION_SUBMITTED,
    );

    return {
      employeeId,
      financialYear,
      flags: {
        payrollCalculated: hasPayrollRun,
        declarationSubmitted: hasDeclaration,
        auditTrailPresent: trail.length > 0,
      },
      compliant: hasPayrollRun,
      checkedAt: new Date().toISOString(),
    };
  }
}
