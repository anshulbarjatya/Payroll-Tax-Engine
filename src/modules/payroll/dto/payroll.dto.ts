import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { TaxRegime } from '../../../common/enums/tax-regime.enum';

export class CalculatePayrollDto {
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNumber()
  @Min(1)
  ctc!: number;

  @IsOptional()
  @IsString()
  salaryStructureId?: string;
}

export class QuickCtcDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNumber()
  @Min(1)
  ctc!: number;
}

export class CompareRegimesDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNumber()
  @Min(1)
  ctc!: number;

  @IsOptional()
  section80c?: number;

  @IsOptional()
  section80d?: number;

  @IsOptional()
  hraExemption?: number;
}

export class BulkPayrollDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  employeeIds!: string[];
}
