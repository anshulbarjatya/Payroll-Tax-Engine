import { Injectable, BadRequestException } from '@nestjs/common';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditService } from '../../common/services/audit.service';
import { PayrollEngine } from '../../core/payroll.engine';
import { EmployeeService } from '../employee/employee.service';
import { SalaryStructureService } from '../salary-structure/salary-structure.service';
import { DeclarationsService } from '../declarations/declarations.service';
import {
  BulkPayrollDto,
  CalculatePayrollDto,
  CompareRegimesDto,
  QuickCtcDto,
} from './dto/payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    private readonly payrollEngine: PayrollEngine,
    private readonly employeeService: EmployeeService,
    private readonly salaryStructureService: SalaryStructureService,
    private readonly declarationsService: DeclarationsService,
    private readonly auditService: AuditService,
  ) {}

  calculateFull(dto: CalculatePayrollDto) {
    let input = {
      countryCode: dto.countryCode,
      financialYear: dto.financialYear,
      taxRegime: dto.taxRegime,
      ctc: dto.ctc,
      state: dto.state,
      employeeId: dto.employeeId,
    };

    if (dto.employeeId) {
      const employee = this.employeeService.findOne(dto.employeeId);
      input = {
        ...input,
        taxRegime: dto.taxRegime ?? employee.taxRegime,
        ctc: dto.ctc ?? employee.ctc,
        state: dto.state ?? employee.state,
      };
    }

    const salaryComponents = dto.salaryStructureId
      ? this.salaryStructureService.findOne(dto.salaryStructureId).components
      : undefined;

    const declarations = dto.employeeId
      ? this.declarationsService.getLatestForEmployee(dto.employeeId, dto.financialYear)
      : undefined;

    const result = this.payrollEngine.calculate({
      ...input,
      salaryComponents,
      declarations,
    });

    this.auditService.log(
      AuditAction.PAYROLL_CALCULATED,
      'payroll',
      dto.employeeId ?? 'anonymous',
      { ctc: dto.ctc, taxRegime: dto.taxRegime },
    );

    return result;
  }

  quickCtc(dto: QuickCtcDto) {
    return this.payrollEngine.calculate({
      countryCode: dto.countryCode,
      financialYear: dto.financialYear,
      taxRegime: dto.taxRegime,
      ctc: dto.ctc,
      state: dto.state,
    });
  }

  compareRegimes(dto: CompareRegimesDto) {
    return this.payrollEngine.compareRegimes({
      countryCode: dto.countryCode,
      financialYear: dto.financialYear,
      ctc: dto.ctc,
      state: dto.state,
      declarations: {
        section80c: dto.section80c ?? 0,
        section80d: dto.section80d ?? 0,
        hraExemption: dto.hraExemption ?? 0,
      },
    });
  }

  bulkRun(dto: BulkPayrollDto) {
    if (!dto.employeeIds?.length) {
      throw new BadRequestException('employeeIds array is required');
    }

    const results = dto.employeeIds.map((id) => {
      try {
        const employee = this.employeeService.findOne(id);
        const declarations = this.declarationsService.getLatestForEmployee(
          id,
          dto.financialYear,
        );
        const salaryComponents = employee.salaryStructureId
          ? this.salaryStructureService.findOne(employee.salaryStructureId).components
          : undefined;

        return {
          employeeId: id,
          success: true,
          payroll: this.payrollEngine.calculate({
            countryCode: dto.countryCode,
            financialYear: dto.financialYear,
            taxRegime: employee.taxRegime,
            ctc: employee.ctc,
            state: employee.state,
            employeeId: id,
            salaryComponents,
            declarations,
          }),
        };
      } catch (error) {
        return {
          employeeId: id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    return {
      processed: results.length,
      successful: results.filter((r) => r.success).length,
      results,
    };
  }
}
