import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentService } from './services/attachment.service';
import { AttachmentController } from './attachment.controller';
import { Attachment } from './entities/attachment.entity';
import { FileService } from './services/file.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment]), CommonModule],
  controllers: [AttachmentController],
  providers: [AttachmentService, FileService],
})
export class AttachmentModule {}
