import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CountryCode } from '../../../common/enums/country-code.enum';

export class StatutoryContributionsDto {
  @IsEnum(CountryCode)
  countryCode!: CountryCode;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsNumber()
  @Min(0)
  grossMonthly!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basicMonthly?: number;

  @IsOptional()
  @IsString()
  state?: string;
}
