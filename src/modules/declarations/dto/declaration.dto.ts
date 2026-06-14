import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SubmitDeclarationDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  financialYear!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  section80c?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  section80d?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  section80ccd1b?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hraExemption?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ltaExemption?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  section24b?: number;
}
