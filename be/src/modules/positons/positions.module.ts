import { forwardRef, Module } from '@nestjs/common';
import { PositionsService } from './application/services/positions.service';
import { PositionsController } from './presentation/http/positions.controller';
import { I_POSITION_REPOSITORY } from './domain/repositories/position.repository.interface';
import { PrismaPositionRepository } from './infrastructure/database/prisma/position.prisma.repository';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
    imports: [forwardRef(() => DepartmentsModule)],
    controllers: [PositionsController],
    providers: [
        PositionsService,
        {
            provide: I_POSITION_REPOSITORY,
            useClass: PrismaPositionRepository,
        },
    ],
    exports: [I_POSITION_REPOSITORY],
})
export class PositionsModule { }
