import { Global, Module } from '@nestjs/common';
import { PayrollEngine } from './payroll.engine';
import { CountryRegistryService } from './country-registry.service';
import { SalaryCalculator } from './calculators/salary.calculator';
import { SlabTaxCalculator } from './calculators/slab-tax.calculator';
import { IndiaPayrollStrategy } from '../countries/india/india.strategy';
import { UsPayrollStrategy } from '../countries/us/us.strategy';
import { UkPayrollStrategy } from '../countries/uk/uk.strategy';
import { SingaporePayrollStrategy } from '../countries/singapore/sg.strategy';

@Global()
@Module({
  providers: [
    PayrollEngine,
    CountryRegistryService,
    SalaryCalculator,
    SlabTaxCalculator,
    IndiaPayrollStrategy,
    UsPayrollStrategy,
    UkPayrollStrategy,
    SingaporePayrollStrategy,
  ],
  exports: [PayrollEngine, CountryRegistryService, SalaryCalculator, SlabTaxCalculator],
})
export class CoreModule {}
