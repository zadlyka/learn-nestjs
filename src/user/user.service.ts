import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
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
