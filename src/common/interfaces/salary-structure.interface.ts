import { SalaryComponentType } from '../enums/salary-component-type.enum';

export interface SalaryComponent {
  name: string;
  type: SalaryComponentType;
  value: number;
  isTaxable?: boolean;
}

export interface SalaryStructure {
  id: string;
  name: string;
  countryCode: string;
  components: SalaryComponent[];
  createdAt: string;
}
