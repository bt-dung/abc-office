import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { Permissions } from '../../../auth/presentation/decorators/permissions.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { PermissionScope } from '../../../auth/presentation/decorators/permission-scope.decorator';
import type { RequestUser } from '../../../auth/domain/types/request-user.type';
import { Audit } from '../../../../common/audit/audit.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { IStorageService, I_STORAGE_SERVICE } from '../../infrastructure/storage/storage.interface';
import { Inject } from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(I_STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) { }

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

  @Patch(':id/avatar')
  @Permissions('users:write')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() requester: RequestUser,
    @PermissionScope() scope: string,
  ) {
    const objectName = await this.storageService.uploadFile(file, 'avatars');
    await this.usersService.updateProfileImage(id, objectName, 'avatar', requester.id, scope);
    return { message: 'Cập nhật ảnh đại diện thành công', path: objectName };
  }

  @Patch(':id/cover')
  @Permissions('users:write')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() requester: RequestUser,
    @PermissionScope() scope: string,
  ) {
    const objectName = await this.storageService.uploadFile(file, 'covers');
    await this.usersService.updateProfileImage(id, objectName, 'cover', requester.id, scope);
    return { message: 'Cập nhật ảnh bìa thành công', path: objectName };
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

  @Permissions('users:write')
  @Audit('user:create', 'User')
  @Post('/create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Permissions('users:manage_position')
  @Audit('user:update_position', 'User')
  @Patch(':id/position/update')
  updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.usersService.updatePosition(id, dto, currentUser.id, scope);
  }
}
