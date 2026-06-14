import { TaxRegime } from '../enums/tax-regime.enum';
import { IndianState } from '../enums/indian-state.enum';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  pan: string;
  countryCode: string;
  financialYear: string;
  taxRegime: TaxRegime;
  state: IndianState;
  dateOfJoining: string;
  ctc: number;
  salaryStructureId?: string;
  createdAt: string;
  updatedAt: string;
}
