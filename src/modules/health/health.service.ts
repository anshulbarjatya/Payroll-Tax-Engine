import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      service: 'Payroll Tax Engine',
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
