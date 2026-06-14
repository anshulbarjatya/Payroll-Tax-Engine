import { EmployerCostSummary } from './employer-cost.interface';

export interface PayrollComponent {
  name: string;
  amount: number;
  type: 'earning' | 'deduction' | 'employer_contribution';
  category?: string;
}

export interface PayrollBreakdown {
  employeeId?: string;
  countryCode: string;
  financialYear: string;
  taxRegime: string;
  ctc: number;
  grossSalary: number;
  earnings: PayrollComponent[];
  employeeDeductions: PayrollComponent[];
  employerContributions: PayrollComponent[];
  netPay: number;
  totalEmployerCost: number;
  employerCostSummary: EmployerCostSummary;
  taxDetails: {
    taxableIncome: number;
    incomeTax: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    monthlyTds: number;
  };
  calculatedAt: string;
}
