import { Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';
import { Attachment } from '../entities/attachment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate, FilterOperator } from 'nestjs-paginate';
import { FileService } from './file.service';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly fileService: FileService,
  ) {}
  async create(createAttachmentDto: CreateAttachmentDto) {
    const attachment = this.attachmentRepository.create(createAttachmentDto);
    await this.attachmentRepository.save(attachment);
    return this.findOne(attachment.id);
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.attachmentRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      filterableColumns: {
        name: [FilterOperator.EQ],
        email: [FilterOperator.EQ],
      },
    });
  }

  findOne(id: string) {
    return this.attachmentRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateAttachmentDto: UpdateAttachmentDto) {
    await this.attachmentRepository.update(id, updateAttachmentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const attachment = await this.findOne(id);
    return this.attachmentRepository.softRemove(attachment);
  }

  async move(id: string) {
    const attachment = await this.findOne(id);
    const url = await this.fileService.move(attachment.url);
    return this.update(id, { url });
  }
}
