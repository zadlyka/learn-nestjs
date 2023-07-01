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

const key = 'user';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...attrsUser } = createUserDto;
    const hash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash('not-set', 10);
    const user = this.userRepository.create({ ...attrsUser, password: hash });
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
    await this.userRepository.update(id, updateUserDto);
    await this.cacheManager.del(key);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.cacheManager.del(key);
    return this.userRepository.softRemove(user);
  }
}
