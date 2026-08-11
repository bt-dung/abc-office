import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { Permissions } from '../../../auth/presentation/decorators/permissions.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { PermissionScope } from '../../../auth/presentation/decorators/permission-scope.decorator';
import type { RequestUser } from '../../../auth/domain/types/request-user.type';
import { Audit } from '../../../../common/audit/audit.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions('users:write')
  @Audit('user:create', 'User')
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Permissions('users:read')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions('users:read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.usersService.findOne(id, currentUser.id, scope);
  }

  @Permissions('users:write')
  @Audit('user:update', 'User')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.usersService.update(id, dto, currentUser.id, scope);
  }

  @Permissions('users:write')
  @Audit('user:activate', 'User')
  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.activate(id);
  }

  @Permissions('users:write')
  @Audit('user:deactivate', 'User')
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivate(id);
  }
}
