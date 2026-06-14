import { Injectable } from '@nestjs/common';
import { SalaryComponentType } from '../../common/enums/salary-component-type.enum';
import { SalaryComponent } from '../../common/interfaces/salary-structure.interface';
import { SalaryBreakdown } from '../interfaces/country-payroll.strategy.interface';

@Injectable()
export class SalaryCalculator {
  breakdown(ctc: number, components: SalaryComponent[]): SalaryBreakdown {
    const monthlyCtc = Math.round(ctc / 12);
    let basicMonthly = 0;

    for (const comp of components) {
      if (comp.type === SalaryComponentType.BALANCING_FIGURE) continue;
      let monthly = 0;
      if (comp.type === SalaryComponentType.PERCENTAGE_OF_CTC) {
        monthly = Math.round(monthlyCtc * (comp.value / 100));
      } else if (comp.type === SalaryComponentType.FIXED) {
        monthly = comp.value;
      }
      if (comp.name.toLowerCase() === 'basic') basicMonthly = monthly;
    }

    const finalComponents = components.map((comp) => {
      if (comp.type === SalaryComponentType.PERCENTAGE_OF_BASIC) {
        return {
          name: comp.name,
          monthly: Math.round(basicMonthly * (comp.value / 100)),
          isTaxable: comp.isTaxable ?? false,
        };
      }
      if (comp.type === SalaryComponentType.PERCENTAGE_OF_CTC) {
        const monthly = Math.round(monthlyCtc * (comp.value / 100));
        return { name: comp.name, monthly, isTaxable: comp.isTaxable ?? true };
      }
      if (comp.type === SalaryComponentType.FIXED) {
        return { name: comp.name, monthly: comp.value, isTaxable: comp.isTaxable ?? true };
      }
      if (comp.type === SalaryComponentType.BALANCING_FIGURE) {
        const allocated = components
          .filter((c) => c.type !== SalaryComponentType.BALANCING_FIGURE)
          .reduce((sum, c) => {
            if (c.type === SalaryComponentType.PERCENTAGE_OF_CTC) {
              return sum + Math.round(monthlyCtc * (c.value / 100));
            }
            if (c.type === SalaryComponentType.PERCENTAGE_OF_BASIC) {
              return sum + Math.round(basicMonthly * (c.value / 100));
            }
            if (c.type === SalaryComponentType.FIXED) return sum + c.value;
            return sum;
          }, 0);
        return {
          name: comp.name,
          monthly: Math.max(0, monthlyCtc - allocated),
          isTaxable: comp.isTaxable ?? true,
        };
      }
      return { name: comp.name, monthly: 0, isTaxable: true };
    });

    const unique = Array.from(
      new Map(finalComponents.map((c) => [c.name, c])).values(),
    );
    basicMonthly = unique.find((c) => c.name.toLowerCase() === 'basic')?.monthly ?? basicMonthly;
    const grossMonthly = unique.reduce((s, c) => s + c.monthly, 0);

    return {
      ctc,
      monthlyCtc,
      components: unique.map((c) => ({ ...c, annual: c.monthly * 12 })),
      grossMonthly,
      grossAnnual: grossMonthly * 12,
      basicMonthly,
      basicAnnual: basicMonthly * 12,
    };
  }
}
