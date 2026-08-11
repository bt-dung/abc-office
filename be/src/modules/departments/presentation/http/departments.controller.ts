import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from '../../application/services/departments.service';
import { CreateDepartmentDto } from '../../application/dtos/create-department.dto';
import { UpdateDepartmentDto } from '../../application/dtos/update-department.dto';
import { AddChildDepartmentDto } from '../../application/dtos/add-child-department.dto';
import { Permissions } from '../../../auth/presentation/decorators/permissions.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { PermissionScope } from '../../../auth/presentation/decorators/permission-scope.decorator';
import type { RequestUser } from '../../../auth/domain/types/request-user.type';
import { Audit } from '../../../../common/audit/audit.decorator';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @Permissions('departments:write')
  @Audit('department:create', 'Department')
  @Post()
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.departmentsService.create(createDepartmentDto, currentUser.id, scope);
  }

  @Permissions('departments:write')
  @Audit('department:add_child', 'Department')
  @Post(':parentId/children')
  addChildDepartment(
    @Param('parentId', ParseIntPipe) parentId: number,
    @Body() addChildDepartmentDto: AddChildDepartmentDto,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.departmentsService.addChildDepartment(
      parentId,
      addChildDepartmentDto,
      currentUser.id,
      scope,
    );
  }

  @Permissions('departments:read')
  @Get()
  findAll(
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.departmentsService.findAll(currentUser.id, scope);
  }

  @Permissions('departments:read')
  @Get('me/members')
  getMyTeam(@CurrentUser() currentUser: RequestUser) {
    return this.departmentsService.getOwnTeam(currentUser.dept_id);
  }

  @Permissions('departments:read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.departmentsService.findOne(id, currentUser.id, scope);
  }

  @Permissions('departments:write')
  @Audit('department:update', 'Department')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto, currentUser.id, scope);
  }

  @Permissions('departments:write')
  @Audit('department:dissolve', 'Department')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
    @PermissionScope() scope: string,
  ) {
    return this.departmentsService.remove(id, currentUser.id, scope);
  }
}
