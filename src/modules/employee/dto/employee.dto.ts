import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaxRegime } from '../../../common/enums/tax-regime.enum';
import { IndianState } from '../../../common/enums/indian-state.enum';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeCode!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  pan!: string;

  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;

  @IsEnum(IndianState)
  state!: IndianState;

  @IsString()
  @IsNotEmpty()
  dateOfJoining!: string;

  @IsNumber()
  @Min(1)
  ctc!: number;

  @IsOptional()
  @IsString()
  salaryStructureId?: string;
}

export class UpdateTaxRegimeDto {
  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;
}
