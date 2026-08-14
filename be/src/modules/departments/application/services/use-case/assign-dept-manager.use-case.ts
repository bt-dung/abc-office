import {
    Injectable,
    Inject,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { I_DEPARTMENT_REPOSITORY, type IDepartmentRepository } from '../../../domain/repositories/department.repository.interface';
import { I_USER_REPOSITORY, type IUserRepository } from '../../../../users/domain/repositories/user.repository.interface';
import { UserStatus } from '../../../../users/domain/entities/user.entity';

@Injectable()
export class ChangeDepartmentManagerUseCase {
    constructor(
        @Inject(I_DEPARTMENT_REPOSITORY)
        private readonly departmentRepo: IDepartmentRepository,

        @Inject(I_USER_REPOSITORY)
        private readonly userRepo: IUserRepository,
    ) { }

    async execute(
        departmentId: number,
        newManagerId: number | null,
        requesterId: number,
        scope: 'own' | 'all',
    ) {
        const department =
            await this.departmentRepo.findById(departmentId);

        if (!department) {
            throw new NotFoundException(
                `Phòng ban với ID ${departmentId} không tồn tại.`,
            );
        }

        if (
            scope === 'own' &&
            department.manager_id !== requesterId
        ) {
            throw new ForbiddenException(
                'Chỉ trưởng phòng quản lý phòng ban này mới được thay đổi người quản lý.',
            );
        }

        if (newManagerId !== null) {
            const newManager =
                await this.userRepo.findById(newManagerId);

            if (!newManager) {
                throw new NotFoundException(
                    `User với ID ${newManagerId} không tồn tại để làm quản lý.`,
                );
            }

            if (newManager.status !== UserStatus.ACTIVE) {
                throw new BadRequestException(
                    `User ${newManager.username} không hoạt động, không thể làm quản lý.`,
                );
            }
        }

        department.changeManager(newManagerId);

        return this.departmentRepo.update(
            departmentId,
            department,
        );
    }
}
