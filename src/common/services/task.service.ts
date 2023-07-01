import { Injectable } from '@nestjs/common';
import { CustomLogger } from './custom-logger.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private customLogger: CustomLogger) {
    this.customLogger.setContext(TaskService.name);
  }

  @Cron('45 * * * * *')
  handleCron() {
    this.customLogger.debug('Called when the second is 45');
  }

  @Interval(10000)
  handleInterval() {
    this.customLogger.debug('Called every 10 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.customLogger.debug('Called once after 5 seconds');
  }
}
