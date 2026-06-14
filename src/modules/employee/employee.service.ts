import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { Employee } from '../../common/interfaces/employee.interface';
import { AuditService } from '../../common/services/audit.service';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { CreateEmployeeDto, UpdateTaxRegimeDto } from './dto/employee.dto';

const COLLECTION = 'employees';
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

@Injectable()
export class EmployeeService {
  constructor(
    private readonly storage: LocalStorageService,
    private readonly auditService: AuditService,
  ) {}

  create(dto: CreateEmployeeDto): Employee {
    if (!PAN_REGEX.test(dto.pan.toUpperCase())) {
      throw new BadRequestException('Invalid PAN format');
    }

    const duplicate = this.storage.findOne<Employee>(
      COLLECTION,
      (e) => e.employeeCode === dto.employeeCode || e.email === dto.email,
    );
    if (duplicate) {
      throw new ConflictException('Employee with same code or email already exists');
    }

    const now = new Date().toISOString();
    const employee: Employee = {
      id: randomUUID(),
      ...dto,
      pan: dto.pan.toUpperCase(),
      createdAt: now,
      updatedAt: now,
    };

    this.storage.insert(COLLECTION, employee);
    this.auditService.log(AuditAction.EMPLOYEE_CREATED, 'employee', employee.id, {
      employeeCode: employee.employeeCode,
    });

    return employee;
  }

  findOne(idOrCode: string): Employee {
    const employee = this.resolveEmployee(idOrCode);
    if (!employee) {
      throw new NotFoundException(
        `Employee not found: ${idOrCode}. Use the "id" (UUID) or "employeeCode" (e.g. EMP001) from the create response.`,
      );
    }
    return employee;
  }

  updateTaxRegime(idOrCode: string, dto: UpdateTaxRegimeDto): Employee {
    const existing = this.resolveEmployee(idOrCode);
    if (!existing) {
      throw new NotFoundException(`Employee not found: ${idOrCode}`);
    }

    const employee = this.storage.update<Employee>(COLLECTION, existing.id, (record) => ({
      ...record,
      taxRegime: dto.taxRegime,
      updatedAt: new Date().toISOString(),
    }));

    this.auditService.log(AuditAction.TAX_REGIME_UPDATED, 'employee', existing.id, {
      taxRegime: dto.taxRegime,
    });

    return employee;
  }

  findAll(): Employee[] {
    return this.storage.getAll<Employee>(COLLECTION);
  }

  /** Lookup by UUID id or employeeCode (e.g. EMP001). */
  resolveEmployee(idOrCode: string): Employee | undefined {
    return this.storage.findOne<Employee>(
      COLLECTION,
      (e) => e.id === idOrCode || e.employeeCode === idOrCode,
    );
  }
}
