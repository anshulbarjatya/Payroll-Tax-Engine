import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SalaryComponentType } from '../../../common/enums/salary-component-type.enum';

export class SalaryComponentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(SalaryComponentType)
  type!: SalaryComponentType;

  @IsNumber()
  value!: number;

  @IsOptional()
  @IsBoolean()
  isTaxable?: boolean;
}

export class CreateSalaryStructureDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  countryCode!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  components!: SalaryComponentDto[];
}

export class SalaryBreakdownQueryDto {
  @IsNumber()
  ctc!: number;

  @IsOptional()
  @IsString()
  structureId?: string;
}
