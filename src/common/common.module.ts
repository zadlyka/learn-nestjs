import { Module } from '@nestjs/common';
import { CustomLogger } from './services/custom-logger.service';
import { TaskService } from './services/task.service';

@Module({
  providers: [CustomLogger, TaskService],
  exports: [CustomLogger],
})
export class CommonModule {}
