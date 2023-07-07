import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate, FilterOperator } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AttachmentService } from '../../attachment/services/attachment.service';
import { CustomLogger } from '../../common/services/custom-logger.service';

const key = 'user';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private attachmentService: AttachmentService,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(UserService.name);
  }

  async create(createUserDto: CreateUserDto) {
    const { password, profileId, identityCardId, ...attrsUser } = createUserDto;
    const hash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash('not-set', 10);

    if (profileId) {
      try {
        await this.processAttachment(profileId);
      } catch (error) {
        this.customLogger.error(error);
      }
    }

    if (identityCardId) {
      try {
        await this.processAttachment(identityCardId);
      } catch (error) {
        this.customLogger.error(error);
      }
    }

    const user = this.userRepository.create({
      ...attrsUser,
      password: hash,
      profileId,
      identityCardId,
    });
    await this.userRepository.save(user);
    await this.cacheManager.del(key);
    return this.findOne(user.id);
  }

  async findAll(query: PaginateQuery) {
    const cache = await this.cacheManager.get(key);
    if (cache) return cache;

    const item = await paginate(query, this.userRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        name: [FilterOperator.EQ],
        email: [FilterOperator.EQ],
      },
      relations: ['profile', 'identityCard'],
    });
    await this.cacheManager.set(key, item);
    return item;
  }

  findOne(id: string) {
    return this.userRepository.findOneByOrFail({ id });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneByOrFail([{ email: username }]);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { profileId, identityCardId } = updateUserDto;
    if (profileId) {
      try {
        await this.processAttachment(profileId);
      } catch (error) {
        this.customLogger.error(error);
      }
    }

    if (identityCardId) {
      try {
        await this.processAttachment(identityCardId);
      } catch (error) {
        this.customLogger.error(error);
      }
    }

    await this.userRepository.update(id, updateUserDto);
    await this.cacheManager.del(key);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.cacheManager.del(key);
    return this.userRepository.softRemove(user);
  }

  private processAttachment(attachmentId: string) {
    return this.attachmentService.move(attachmentId);
  }
}
