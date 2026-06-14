import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateTaxRegimeDto } from './dto/employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id/tax-regime')
  updateTaxRegime(@Param('id') id: string, @Body() dto: UpdateTaxRegimeDto) {
    return this.employeeService.updateTaxRegime(id, dto);
  }
}
