import { Module } from '@nestjs/common';
import { CustomLogger } from './services/custom-logger.service';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class CommonModule {}
