import { Module } from '@nestjs/common';
import { PositionsService } from './application/services/positions.service';
import { PositionsController } from './presentation/http/positions.controller';
import { I_POSITION_REPOSITORY } from './domain/repositories/position.repository.interface';
import { PrismaPositionRepository } from './infrastructure/database/prisma/position.prisma.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { I_DEPARTMENT_REPOSITORY } from '../departments/domain/repositories/department.repository.interface';
import { PrismaDepartmentRepository } from '../departments/infrastructure/database/prisma/department.prisma.repository';

@Module({
    controllers: [PositionsController],
    providers: [
        PositionsService,
        PrismaService,
        {
            provide: I_POSITION_REPOSITORY,
            useClass: PrismaPositionRepository,
        },
        {
            provide: I_DEPARTMENT_REPOSITORY,
            useClass: PrismaDepartmentRepository,
        },
    ],
})
export class PositionsModule { }
