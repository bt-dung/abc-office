import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { PositionsService } from '../../application/services/positions.service';
import { CreatePositionDto } from '../../application/dtos/create-position.dto';
import { UpdatePositionDto } from '../../application/dtos/update-position.dto';
import { Permissions } from '../../../auth/presentation/decorators/permissions.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { PermissionScope } from '../../../auth/presentation/decorators/permission-scope.decorator';
import type { RequestUser } from '../../../auth/domain/types/request-user.type';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) { }

    @Post()
    @Permissions('positions:write')
    create(
        @Body() createPositionDto: CreatePositionDto,
        @CurrentUser() currentUser: RequestUser,
        @PermissionScope() scope: string,
    ) {
        return this.positionsService.create(createPositionDto, currentUser.id, scope);
    }

    @Get()
    @Permissions('positions:read')
    findAll(@Query('dept_id') dept_id?: string) {
        if (dept_id) {
            return this.positionsService.findAllByDepartment(parseInt(dept_id, 10));
        }
        return this.positionsService.findAll();
    }

    @Get(':id')
    @Permissions('positions:read')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.positionsService.findOne(id);
    }

    @Patch(':id')
    @Permissions('positions:write')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePositionDto: UpdatePositionDto,
        @CurrentUser() currentUser: RequestUser,
        @PermissionScope() scope: string,
    ) {
        return this.positionsService.update(id, updatePositionDto, currentUser.id, scope);
    }

    @Delete(':id')
    @Permissions('positions:write')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: RequestUser,
        @PermissionScope() scope: string,
    ) {
        return this.positionsService.remove(id, currentUser.id, scope);
    }
}