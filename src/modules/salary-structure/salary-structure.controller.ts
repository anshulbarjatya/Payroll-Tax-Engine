import { Body, Controller, Get, Post, Query, BadRequestException } from '@nestjs/common';
import { SalaryStructureService } from './salary-structure.service';
import { CreateSalaryStructureDto } from './dto/salary-structure.dto';

@Controller('salary-structures')
export class SalaryStructureController {
  constructor(private readonly salaryStructureService: SalaryStructureService) {}

  @Post()
  create(@Body() dto: CreateSalaryStructureDto) {
    return this.salaryStructureService.create(dto);
  }

  @Get('breakdown')
  getBreakdown(
    @Query('ctc') ctc: string,
    @Query('structure_id') structureId?: string,
  ) {
    const ctcNum = Number(ctc);
    if (!ctc || isNaN(ctcNum) || ctcNum <= 0) {
      throw new BadRequestException('Valid ctc query param is required');
    }
    return this.salaryStructureService.getBreakdown(ctcNum, structureId);
  }
}
