import { Global, Module } from '@nestjs/common';
import { LocalStorageService } from './storage/local-storage.service';
import { AuditService } from './services/audit.service';

@Global()
@Module({
  providers: [LocalStorageService, AuditService],
  exports: [LocalStorageService, AuditService],
})
export class CommonModule {}
