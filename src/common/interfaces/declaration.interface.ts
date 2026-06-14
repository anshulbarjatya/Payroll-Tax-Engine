import { DeclarationStatus } from '../enums/declaration-status.enum';

export interface InvestmentDeclaration {
  id: string;
  employeeId: string;
  financialYear: string;
  section80c: number;
  section80d: number;
  section80ccd1b: number;
  hraExemption: number;
  ltaExemption: number;
  section24b: number;
  status: DeclarationStatus;
  submittedAt?: string;
  createdAt: string;
}
