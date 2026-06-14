import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { InvestmentDeclaration } from '../../common/interfaces/declaration.interface';
import { TaxRules } from '../../common/interfaces/tax-slab.interface';

export interface SalaryBreakdown {
  ctc: number;
  monthlyCtc: number;
  components: { name: string; monthly: number; annual: number; isTaxable: boolean }[];
  grossMonthly: number;
  grossAnnual: number;
  basicMonthly: number;
  basicAnnual: number;
}

/** One statutory line with both employee and employer sides (generic shape). */
export interface StatutoryLine {
  code: string;
  name: string;
  employeeAmount: number;
  employerAmount: number;
  employerBreakdown?: { name: string; amount: number }[];
  metadata?: Record<string, unknown>;
}

export interface TaxResult {
  grossTaxableIncome: number;
  deductions: Record<string, number>;
  taxableIncome: number;
  slabBreakdown: { slab: string; taxableAmount: number; tax: number }[];
  incomeTax: number;
  surcharge: number;
  cess: number;
  rebate: number;
  totalTax: number;
  monthlyWithholding: number;
}

export interface PayrollCalculationContext {
  countryCode: string;
  financialYear: string;
  taxRegime: string;
  ctc: number;
  state?: string;
  salary: SalaryBreakdown;
  declarations?: Partial<InvestmentDeclaration>;
}

export interface CountryPayrollStrategy {
  readonly countryCode: string;
  getDefaultSalaryComponents(): SalaryComponent[];
  calculateStatutory(ctx: PayrollCalculationContext): StatutoryLine[];
  calculateTax(ctx: PayrollCalculationContext): TaxResult;
  supportsRegimeComparison(): boolean;
  getTaxRules(financialYear: string, regime: string): TaxRules;
  getStatutoryConfig(): Record<string, unknown>;
}

export interface PayrollEngineInput {
  countryCode: string;
  financialYear: string;
  taxRegime: string;
  ctc: number;
  state?: string;
  employeeId?: string;
  salaryComponents?: SalaryComponent[];
  declarations?: Partial<InvestmentDeclaration>;
  month?: number;
}
