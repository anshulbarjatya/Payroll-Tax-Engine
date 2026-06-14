import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { PayrollEngine } from '../../core/payroll.engine';
import { DeclarationsService } from '../declarations/declarations.service';
import { SalaryStructureService } from '../salary-structure/salary-structure.service';

@Injectable()
export class PayslipService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly payrollEngine: PayrollEngine,
    private readonly declarationsService: DeclarationsService,
    private readonly salaryStructureService: SalaryStructureService,
  ) {}

  generatePayslip(employeeId: string, month: number, financialYear: string) {
    const employee = this.employeeService.findOne(employeeId);
    const declarations = this.declarationsService.getLatestForEmployee(
      employeeId,
      financialYear,
    );
    const salaryComponents = employee.salaryStructureId
      ? this.salaryStructureService.findOne(employee.salaryStructureId).components
      : undefined;

    const payroll = this.payrollEngine.calculate({
      countryCode: employee.countryCode,
      financialYear,
      taxRegime: employee.taxRegime,
      ctc: employee.ctc,
      state: employee.state,
      employeeId,
      salaryComponents,
      declarations,
      month,
    });

    return {
      payslipId: `PS-${employee.employeeCode}-${financialYear}-M${String(month).padStart(2, '0')}`,
      employee: {
        id: employee.id,
        name: employee.name,
        employeeCode: employee.employeeCode,
        pan: employee.pan,
      },
      period: { month, financialYear },
      earnings: payroll.earnings,
      deductions: payroll.employeeDeductions,
      netPay: payroll.netPay,
      grossPay: payroll.grossSalary,
      generatedAt: new Date().toISOString(),
    };
  }

  getForm16Data(employeeId: string, financialYear: string) {
    const employee = this.employeeService.findOne(employeeId);
    const declarations = this.declarationsService.getLatestForEmployee(
      employeeId,
      financialYear,
    );

    const payroll = this.payrollEngine.calculate({
      countryCode: employee.countryCode,
      financialYear,
      taxRegime: employee.taxRegime,
      ctc: employee.ctc,
      state: employee.state,
      employeeId,
      declarations,
    });

    return {
      employee: {
        name: employee.name,
        pan: employee.pan,
        employeeCode: employee.employeeCode,
      },
      employer: {
        name: 'Demo Employer Pvt Ltd',
        tan: 'DELH12345A',
      },
      financialYear,
      taxRegime: employee.taxRegime,
      salary: {
        grossSalary: payroll.grossSalary * 12,
        taxableIncome: payroll.taxDetails.taxableIncome,
      },
      taxDeducted: {
        totalTax: payroll.taxDetails.totalTax,
        tdsDeducted: payroll.taxDetails.totalTax,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  payrollSummaryReport(financialYear: string) {
    const employees = this.employeeService.findAll();
    const summaries = employees.map((emp) => {
      const payroll = this.payrollEngine.calculate({
        countryCode: emp.countryCode,
        financialYear,
        taxRegime: emp.taxRegime,
        ctc: emp.ctc,
        state: emp.state,
        employeeId: emp.id,
      });
      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        ctc: emp.ctc,
        netPay: payroll.netPay,
        totalTax: payroll.taxDetails.totalTax,
        employerCost: payroll.totalEmployerCost,
      };
    });

    return {
      financialYear,
      employeeCount: summaries.length,
      totalCtc: summaries.reduce((s, e) => s + e.ctc, 0),
      totalNetPay: summaries.reduce((s, e) => s + e.netPay * 12, 0),
      employees: summaries,
      generatedAt: new Date().toISOString(),
    };
  }

  statutoryComplianceReport(financialYear: string) {
    const employees = this.employeeService.findAll();
    const compliance = employees.map((emp) => {
      const payroll = this.payrollEngine.calculate({
        countryCode: emp.countryCode,
        financialYear,
        taxRegime: emp.taxRegime,
        ctc: emp.ctc,
        state: emp.state,
        employeeId: emp.id,
      });

      const pf = payroll.employeeDeductions.find((d) => d.name.includes('PF'));
      const esi = payroll.employeeDeductions.find((d) => d.name.includes('ESI'));
      const pt = payroll.employeeDeductions.find((d) => d.name.includes('Professional'));

      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        pfCompliant: (pf?.amount ?? 0) > 0,
        esiCompliant: esi !== undefined,
        ptCompliant: (pt?.amount ?? 0) >= 0,
        flags: [],
      };
    });

    return {
      financialYear,
      totalEmployees: compliance.length,
      compliantCount: compliance.filter(
        (c) => c.pfCompliant && c.ptCompliant,
      ).length,
      employees: compliance,
      generatedAt: new Date().toISOString(),
    };
  }
}
