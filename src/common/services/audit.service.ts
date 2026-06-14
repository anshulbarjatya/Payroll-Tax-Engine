import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditEntry } from '../interfaces/audit-entry.interface';
import { LocalStorageService } from '../storage/local-storage.service';

const COLLECTION = 'audit_trail';

@Injectable()
export class AuditService {
  constructor(private readonly storage: LocalStorageService) {}

  log(
    action: AuditAction,
    entityType: string,
    entityId: string,
    details: Record<string, unknown> = {},
  ): AuditEntry {
    const entry: AuditEntry = {
      id: randomUUID(),
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.storage.insert(COLLECTION, entry);
    return entry;
  }

  getTrail(entityId?: string, entityType?: string): AuditEntry[] {
    return this.storage
      .findMany<AuditEntry>(COLLECTION, (entry) => {
        if (entityId && entry.entityId !== entityId) return false;
        if (entityType && entry.entityType !== entityType) return false;
        return true;
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}
