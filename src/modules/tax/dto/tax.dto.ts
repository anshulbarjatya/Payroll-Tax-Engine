import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaxRegime } from '../../../common/enums/tax-regime.enum';

export class ComputeIncomeTaxDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;

  @IsNumber()
  @Min(0)
  annualGross!: number;

  @IsOptional()
  section80c?: number;

  @IsOptional()
  section80d?: number;

  @IsOptional()
  section80ccd1b?: number;

  @IsOptional()
  hraExemption?: number;

  @IsOptional()
  ltaExemption?: number;

  @IsOptional()
  section24b?: number;
}

export class ComputeTdsDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;

  @IsNumber()
  @Min(0)
  annualGross!: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  month?: number;
}

export class AnnualProjectionDto {
  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsEnum(TaxRegime)
  taxRegime!: TaxRegime;

  @IsNumber()
  @Min(0)
  annualGross!: number;

  @IsOptional()
  section80c?: number;

  @IsOptional()
  section80d?: number;
}
