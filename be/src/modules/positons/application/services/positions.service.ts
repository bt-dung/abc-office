import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  IPositionRepository,
  I_POSITION_REPOSITORY,
} from '../../domain/repositories/position.repository.interface';
import {
  IDepartmentRepository,
  I_DEPARTMENT_REPOSITORY,
} from '../../../departments/domain/repositories/department.repository.interface';
import { CreatePositionDto } from '../dtos/create-position.dto';
import { UpdatePositionDto } from '../dtos/update-position.dto';
import { Position } from '../../domain/entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @Inject(I_POSITION_REPOSITORY)
    private readonly positionRepo: IPositionRepository,
    @Inject(I_DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
  ) { }

  async create(dto: CreatePositionDto, requesterId: number, scope: string): Promise<Position> {
    const department = await this.departmentRepo.findById(dto.dept_id);
    if (!department) {
      throw new NotFoundException(`Phòng ban với ID ${dto.dept_id} không tồn tại.`);
    }
    this.assertOwnScope(scope, requesterId, department.manager_id);
    const newPosition = Position.createNew(dto);
    return this.positionRepo.create(newPosition);
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepo.findAll();
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepo.findById(id);
    if (!position) {
      throw new NotFoundException(`Không tìm thấy vị trí công việc với ID ${id}`);
    }
    return position;
  }

  async update(id: number, dto: UpdatePositionDto, requesterId: number, scope: string): Promise<Position> {
    const existingPosition = await this.findOne(id);

    // Check permission on the original department
    const originalDepartment = await this.departmentRepo.findById(existingPosition.dept_id);
    if (!originalDepartment) {
      throw new NotFoundException(`Phòng ban gốc của vị trí này (ID ${existingPosition.dept_id}) không tồn tại.`);
    }
    this.assertOwnScope(scope, requesterId, originalDepartment.manager_id);

    // If changing department, check permission on the new department as well
    if (scope === 'own' && dto.dept_id && dto.dept_id !== existingPosition.dept_id) {
      const newDepartment = await this.departmentRepo.findById(dto.dept_id);
      if (!newDepartment) {
        throw new NotFoundException(`Phòng ban mới (ID ${dto.dept_id}) không tồn tại.`);
      }
      this.assertOwnScope(scope, requesterId, newDepartment.manager_id);
    }

    existingPosition.updateInfo(dto);
    return this.positionRepo.update(id, existingPosition);
  }

  async remove(id: number, requesterId: number, scope: string): Promise<void> {
    const existingPosition = await this.findOne(id); // Đảm bảo vị trí tồn tại trước khi xóa
    const department = await this.departmentRepo.findById(existingPosition.dept_id);
    if (!department) {
      throw new NotFoundException(`Phòng ban của vị trí này (ID ${existingPosition.dept_id}) không tồn tại.`);
    }
    this.assertOwnScope(scope, requesterId, department.manager_id);
    await this.positionRepo.delete(id);
  }

  /**
   * Lấy tất cả các vị trí công việc thuộc về một phòng ban cụ thể.
   * @param dept_id ID của phòng ban
   */
  async findAllByDepartment(dept_id: number): Promise<Position[]> {
    // Service gọi đến Repository để lấy dữ liệu
    return this.positionRepo.findByDepartmentId(dept_id);
  }

  private assertOwnScope(scope: string, requesterId: number, managerId: number | null) {
    if (scope === 'own' && managerId !== requesterId) {
      throw new ForbiddenException('Chỉ trưởng phòng quản lý phòng ban này mới được thao tác trên các vị trí công việc.');
    }
  }
}
