import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentService } from './services/attachment.service';
import { AttachmentController } from './attachment.controller';
import { Attachment } from './entities/attachment.entity';
import { FileService } from './services/file.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment]), CommonModule],
  controllers: [AttachmentController],
  providers: [AttachmentService, FileService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
