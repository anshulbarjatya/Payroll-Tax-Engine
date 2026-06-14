import { AuditAction } from '../enums/audit-action.enum';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  timestamp: string;
}
