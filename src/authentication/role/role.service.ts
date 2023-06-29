import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return this.findOne(role.id);
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.roleRepository, {
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
    return this.roleRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    return this.roleRepository.softRemove(role);
  }
}
