import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatePanDto {
  @IsString()
  @IsNotEmpty()
  pan!: string;
}
