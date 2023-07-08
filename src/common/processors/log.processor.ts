import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CustomLogger } from '../services/custom-logger.service';

@Processor('log')
export class AuthProcessor {
  constructor(private customLogger: CustomLogger) {
    this.customLogger.setContext(AuthProcessor.name);
  }
  @Process('transcode')
  async transcode(job: Job) {
    this.customLogger.debug('Start transcoding...');
    //this.customLogger.debug(job.data);
    this.customLogger.debug('Transcoding completed');
  }
}
