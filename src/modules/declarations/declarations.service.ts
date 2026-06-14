import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { DeclarationStatus } from '../../common/enums/declaration-status.enum';
import { InvestmentDeclaration } from '../../common/interfaces/declaration.interface';
import { AuditService } from '../../common/services/audit.service';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { SubmitDeclarationDto } from './dto/declaration.dto';

const COLLECTION = 'declarations';

@Injectable()
export class DeclarationsService {
  constructor(
    private readonly storage: LocalStorageService,
    private readonly auditService: AuditService,
  ) {}

  submit(dto: SubmitDeclarationDto): InvestmentDeclaration {
    const now = new Date().toISOString();
    const declaration: InvestmentDeclaration = {
      id: randomUUID(),
      employeeId: dto.employeeId,
      financialYear: dto.financialYear,
      section80c: dto.section80c ?? 0,
      section80d: dto.section80d ?? 0,
      section80ccd1b: dto.section80ccd1b ?? 0,
      hraExemption: dto.hraExemption ?? 0,
      ltaExemption: dto.ltaExemption ?? 0,
      section24b: dto.section24b ?? 0,
      status: DeclarationStatus.SUBMITTED,
      submittedAt: now,
      createdAt: now,
    };

    this.storage.insert(COLLECTION, declaration);
    this.auditService.log(
      AuditAction.DECLARATION_SUBMITTED,
      'declaration',
      declaration.id,
      { employeeId: dto.employeeId },
    );

    return declaration;
  }

  getStatus(employeeId: string, financialYear: string) {
    const declarations = this.storage
      .findMany<InvestmentDeclaration>(
        COLLECTION,
        (d) => d.employeeId === employeeId && d.financialYear === financialYear,
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    if (!declarations.length) {
      throw new NotFoundException(
        `No declaration found for employee ${employeeId} FY ${financialYear}`,
      );
    }

    return {
      employeeId,
      financialYear,
      latest: declarations[0],
      history: declarations,
    };
  }

  getLatestForEmployee(
    employeeId: string,
    financialYear: string,
  ): InvestmentDeclaration | undefined {
    return this.storage
      .findMany<InvestmentDeclaration>(
        COLLECTION,
        (d) => d.employeeId === employeeId && d.financialYear === financialYear,
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }
}
