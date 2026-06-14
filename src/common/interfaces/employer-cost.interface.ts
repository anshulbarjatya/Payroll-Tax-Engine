import { PayrollComponent } from '../../common/interfaces/payroll-breakdown.interface';

export interface EmployerCostSummary {
  grossSalary: number;
  totalEmployerContributions: number;
  totalCostToCompany: number;
  employerContributionBreakdown: PayrollComponent[];
}
