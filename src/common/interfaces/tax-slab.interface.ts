export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxRules {
  countryCode: string;
  financialYear: string;
  regime: string;
  standardDeduction: number;
  rebateLimit: number;
  rebateAmount: number;
  cessRate: number;
  slabs: TaxSlab[];
  deductionLimits: Record<string, number>;
}
