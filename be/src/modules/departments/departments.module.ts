import { forwardRef, Module } from '@nestjs/common';
import { DepartmentsService } from './application/services/departments.service';
import { DepartmentsController } from './presentation/http/departments.controller';
import { PrismaDepartmentRepository } from './infrastructure/database/prisma/department.prisma.repository';
import { I_DEPARTMENT_REPOSITORY } from './domain/repositories/department.repository.interface';
import { UsersModule } from '../users/users.module';
import { ChangeDepartmentManagerUseCase } from './application/services/use-case/assign-dept-manager.use-case';
@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    ChangeDepartmentManagerUseCase,
    {
      provide: I_DEPARTMENT_REPOSITORY,
      useClass: PrismaDepartmentRepository,
    },
  ],
  exports: [I_DEPARTMENT_REPOSITORY],
})
export class DepartmentsModule { }
