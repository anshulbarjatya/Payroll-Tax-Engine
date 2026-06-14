import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DeclarationsService } from './declarations.service';
import { SubmitDeclarationDto } from './dto/declaration.dto';

@Controller('declarations')
export class DeclarationsController {
  constructor(private readonly declarationsService: DeclarationsService) {}

  @Post()
  submit(@Body() dto: SubmitDeclarationDto) {
    return this.declarationsService.submit(dto);
  }

  @Get(':employeeId/status')
  getStatus(
    @Param('employeeId') employeeId: string,
    @Query('financial_year') financialYear: string,
  ) {
    return this.declarationsService.getStatus(employeeId, financialYear);
  }
}
