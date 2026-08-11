import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IDepartmentRepository } from '../../../domain/repositories/department.repository.interface';
import { Department } from '../../../domain/entities/department.entity';
import { User } from '../../../../users/domain/entities/user.entity';
import { Prisma } from '@prisma/client';

// Định nghĩa một kiểu tái sử dụng cho Department từ Prisma với các quan hệ
type PrismaDepartmentWithRelations = Prisma.DepartmentGetPayload<{
  include: {
    users: true;
    // Include children, nhưng chỉ một cấp. TypeScript sẽ hiểu kiểu của children là Department thông thường.
    children: true;
  };
}>;

@Injectable()
export class PrismaDepartmentRepository implements IDepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Ánh xạ từ Prisma model sang Domain Entity.
  private toDomain(prismaDept: PrismaDepartmentWithRelations): Department {
    // Ánh xạ children, chỉ cần thông tin cơ bản ở cấp này.
    const children = prismaDept.children?.map(child => new Department(child.id, child.name, child.parent_id, child.manager_id)) || [];
    const users = prismaDept.users?.map(user => new User({
        id: user.id,
        username: user.username,
        email: user.email,
        password_hash: user.pw, 
        status: user.status, // Không cần chuyển đổi nữa!
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role_id: user.role_id,
        dept_id: user.dept_id,
        position_id: user.position_id,
      }
    )) || [];

    return new Department(
      prismaDept.id,
      prismaDept.name,
      prismaDept.parent_id,
      prismaDept.manager_id,
      children,
      users
    );
  }

  async create(department: Department): Promise<Department> {
    const createdDept = await this.prisma.department.create({
      data: {
        name: department.name,
        parent_id: department.parent_id,
        manager_id: department.manager_id,
      },
      include: { users: true, children: true },
    });
    return this.toDomain(createdDept);
  }

  async findAll(): Promise<Department[]> {
    // Chỉ lấy các phòng ban ở cấp cao nhất (không có cha)
    const depts = await this.prisma.department.findMany({
      where: { parent_id: null },
      include: { 
        users: true,
        // Sử dụng include lồng nhau để lấy các cấp con
        children: { include: { users: true, children: true } } 
      },
    });
    return depts.map(dept => this.toDomain(dept));
  }

  async findById(id: number): Promise<Department | null> {
    const dept = await this.prisma.department.findUnique({ 
      where: { id },
      include: { users: true, children: { include: { users: true, children: true } } },
    });
    return dept ? this.toDomain(dept) : null;
  }

  async update(id: number, department: Department): Promise<Department> {
    const updatedDept = await this.prisma.department.update({ 
      where: { id }, 
      data: {
        name: department.name,
        parent_id: department.parent_id,
        manager_id: department.manager_id,
      },
      include: { users: true, children: true },
    });
    return this.toDomain(updatedDept);
  }

  async dissolveDepartment(id: number): Promise<void> {
    return await this.prisma.$transaction(async (tx) => {
      // Đưa nhân sự về trạng thái chờ
      await tx.user.updateMany({
        where: { dept_id: id },
        data: { dept_id: null },
      });
      // Xóa phòng ban
      await tx.department.delete({
        where: { id },
      });
    });
  }
}