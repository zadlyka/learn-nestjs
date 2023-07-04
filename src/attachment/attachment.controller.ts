import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './services/attachment.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './services/file.service';

@Controller('attachment')
export class AttachmentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.attachmentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachmentService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.fileService.upload(file);
    return this.attachmentService.create({
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url,
    });
  }

  @Post(':id')
  move(@Param('id') id: string) {
    return this.attachmentService.move(id);
  }
}
