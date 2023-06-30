import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { RequiredPermission } from '../auth/decorators/permissions.decorator';
import { Permission } from '../role/enums/permission.enum';
import { UserOwnerGuard } from './guards/user-owner.guard';

@Controller('user')
@UseGuards(UserOwnerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @RequiredPermission(Permission.ReadUser)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.userService.findAll(query);
  }

  @RequiredPermission(Permission.ReadUser)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
