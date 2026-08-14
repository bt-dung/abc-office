import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException, Logger, HttpException } from '@nestjs/common';
import { I_DEPARTMENT_REPOSITORY } from '../../domain/repositories/department.repository.interface';
import type { IDepartmentRepository } from '../../domain/repositories/department.repository.interface';
import { CreateDepartmentDto } from '../dtos/create-department.dto';
import { UpdateDepartmentDto } from '../dtos/update-department.dto';
import { AddChildDepartmentDto } from '../dtos/add-child-department.dto';
import { Department } from '../../domain/entities/department.entity';
import type { DepartmentScope } from '../types/department-scope.type';


@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @Inject(I_DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
  ) { }

  async create(dto: CreateDepartmentDto, requesterId: number, scope: DepartmentScope) {
    // Tạo phòng ban gốc (không có cha) đòi hỏi quyền 'all' vì chưa có phòng ban
    // nào để xác định người dùng có phải là 'own' hay không.
    if (scope === 'own') {
      throw new ForbiddenException(
        'Không đủ quyền để tạo phòng ban gốc mới.',
      );
    }

    try {
      const newDept = Department.createNew(dto.name, dto.parent_id ?? null, dto.manager_id ?? null);
      const createdDepartment = await this.departmentRepo.create(newDept);
      return createdDepartment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Lỗi không thể tạo phòng ban. Vui lòng kiểm tra lại thông tin!';

      this.logger.error(
        `Lỗi tạo phòng ban:${message}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Lỗi không thể tạo phòng ban. Vui lòng kiểm tra lại thông tin!');

    }
  }

  /**
   * Tạo một phòng ban con cho một phòng ban cha đã tồn tại
   * @param parentId ID của phòng ban cha
   * @param dto Dữ liệu của phòng ban con cần tạo
   * @returns Phòng ban con vừa được tạo
   */
  async addChildDepartment(
    parentId: number,
    dto: AddChildDepartmentDto,
    requesterId: number,
    scope: DepartmentScope,
  ) {
    // 1. Kiểm tra xem phòng ban cha có tồn tại không
    const parent = await this.findOne(parentId);
    this.assertOwnScope(scope, requesterId, parent.manager_id);

    // 2. Sử dụng factory của Entity để tạo đối tượng con (Ra lệnh)
    const newChildDept = Department.createNew(dto.name, parentId, dto.manager_id ?? null);

    // 3. Lưu vào database (Điều phối)
    const createdDepartment = await this.departmentRepo.create(newChildDept);
    return createdDepartment;
  }

  /**
   * Trả về phòng ban + danh sách thành viên của chính requester (theo dept_id
   * của họ), dùng cho role chỉ có departments:read scope 'own' (nhân viên
   * thường xem team của mình) — khác với assertOwnScope vốn chỉ cho phép
   * trưởng phòng (manager_id === requesterId) thao tác.
   */
  async getOwnTeam(requesterDeptId: number | null) {
    if (requesterDeptId === null) {
      throw new NotFoundException('Bạn hiện chưa được phân vào phòng ban nào.');
    }

    const dept = await this.departmentRepo.findById(requesterDeptId);
    if (!dept) {
      throw new NotFoundException(`Không tìm thấy phòng ban với ID ${requesterDeptId}`);
    }

    return {
      id: dept.id,
      name: dept.name,
      members: dept.users.map((u) => u.toSafe()),
    };
  }

  async findAll(requesterId: number, scope: DepartmentScope) {
    const departments = await this.departmentRepo.findAll();
    if (scope === 'own') {
      return departments.filter((d) => d.manager_id === requesterId);
    }
    return departments;
  }

  async findOne(id: number, requesterId?: number, scope?: DepartmentScope) {
    const dept = await this.departmentRepo.findById(id);
    if (!dept) {
      throw new NotFoundException(`Phòng ban với ID ${id} không tồn tại`);
    }
    if (requesterId !== undefined && scope !== undefined) {
      this.assertOwnScope(scope, requesterId, dept.manager_id);
    }
    return dept;
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
    requesterId: number,
    scope: DepartmentScope,
  ) {
    const existingDept = await this.departmentRepo.findById(id);
    if (!existingDept) {
      throw new NotFoundException(`Không tìm thấy phòng ban với ID ${id} để cập nhật`);
    }
    this.assertOwnScope(scope, requesterId, existingDept.manager_id);

    try {
      // Ra lệnh cho Entity tự cập nhật. Entity sẽ tự validate các quy tắc nội tại của nó.
      existingDept.updateInfo({ name: dto.name, parent_id: dto.parent_id });
      if (dto.manager_id !== undefined) {
        existingDept.changeManager(dto.manager_id ?? null);
      }
      const updatedDepartment = await this.departmentRepo.update(id, existingDept);
      return updatedDepartment;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Cập nhật thất bại.';

      this.logger.error(
        `Lỗi cập nhật phòng ban ID ${id}: ${message}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Cập nhật thất bại.');
    }
  }

  async remove(id: number, requesterId: number, scope: DepartmentScope) {
    const existingDept = await this.departmentRepo.findById(id);
    if (!existingDept) {
      throw new NotFoundException(`Không tìm thấy phòng ban với ID ${id}`);
    }
    this.assertOwnScope(scope, requesterId, existingDept.manager_id);

    try {
      const deletedDept = await this.departmentRepo.dissolveDepartment(id);
      this.logger.log(`Phòng ban ID ${id} đã được giải thể, nhân sự đã được đưa về trạng thái chờ.`);
      return deletedDept;
    } catch (error) {
      throw new BadRequestException('Không thể giải thể phòng ban này.');
    }
  }

  private assertOwnScope(
    scope: DepartmentScope,
    requesterId: number,
    managerId: number | null,
  ) {
    if (scope === 'own' && managerId !== requesterId) {
      throw new ForbiddenException(
        'Chỉ trưởng phòng quản lý phòng ban này mới được thao tác.',
      );
    }
  }
}
