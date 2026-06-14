import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { SalaryStructure } from '../../common/interfaces/salary-structure.interface';
import { AuditService } from '../../common/services/audit.service';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { CountryRegistryService } from '../../core/country-registry.service';
import { SalaryCalculator } from '../../core/calculators/salary.calculator';
import { CreateSalaryStructureDto } from './dto/salary-structure.dto';

const COLLECTION = 'salary_structures';

@Injectable()
export class SalaryStructureService {
  constructor(
    private readonly storage: LocalStorageService,
    private readonly salaryCalculator: SalaryCalculator,
    private readonly auditService: AuditService,
    private readonly countryRegistry: CountryRegistryService,
  ) {}

  create(dto: CreateSalaryStructureDto): SalaryStructure {
    const structure: SalaryStructure = {
      id: randomUUID(),
      name: dto.name,
      countryCode: dto.countryCode,
      components: dto.components,
      createdAt: new Date().toISOString(),
    };

    this.storage.insert(COLLECTION, structure);
    this.auditService.log(
      AuditAction.SALARY_STRUCTURE_CREATED,
      'salary_structure',
      structure.id,
      { name: structure.name },
    );

    return structure;
  }

  findOne(id: string): SalaryStructure {
    const structure = this.storage.findOne<SalaryStructure>(
      COLLECTION,
      (s) => s.id === id,
    );
    if (!structure) {
      throw new NotFoundException(`Salary structure not found: ${id}`);
    }
    return structure;
  }

  getBreakdown(ctc: number, structureId?: string, countryCode = 'IN') {
    const components = structureId
      ? this.findOne(structureId).components
      : this.countryRegistry.getStrategy(countryCode).getDefaultSalaryComponents();

    return this.salaryCalculator.breakdown(ctc, components);
  }
}
