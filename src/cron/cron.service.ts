import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_6_HOURS)
  showActualDate() {
    console.log('Actual time: ' + new Date().toLocaleTimeString());
  }
}
