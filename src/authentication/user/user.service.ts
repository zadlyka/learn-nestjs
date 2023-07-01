import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate, FilterOperator } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...attrsUser } = createUserDto;
    const hash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash('not-set', 10);
    const user = this.userRepository.create({ ...attrsUser, password: hash });
    await this.userRepository.save(user);
    return this.findOne(user.id);
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        name: [FilterOperator.EQ],
        email: [FilterOperator.EQ],
      },
    });
  }

  findOne(id: string) {
    return this.userRepository.findOneByOrFail({ id });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneByOrFail([{ email: username }]);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.softRemove(user);
  }
}
