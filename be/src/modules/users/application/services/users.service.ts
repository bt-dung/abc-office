import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I_USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type {
  IUserRepository,
  UserWithDetails,
} from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDetailDto } from '../dtos/user-detail.dto';
import { User } from '../../domain/entities/user.entity';
import {
  I_DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from '../../../departments/domain/repositories/department.repository.interface';
import {
  I_POSITION_REPOSITORY,
  type IPositionRepository,
} from '../../../positons/domain/repositories/position.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(I_DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
    @Inject(I_POSITION_REPOSITORY)
    private readonly positionRepo: IPositionRepository,
  ) { }

  async create(dto: CreateUserDto) {
    const existing =
      (await this.userRepo.findByUsernameOrEmail(dto.username)) ??
      (await this.userRepo.findByUsernameOrEmail(dto.email));
    if (existing) {
      throw new ConflictException('Username hoặc email đã tồn tại.');
    }

    const passwordHash = await User.hashPassword(dto.password);
    const newUser = User.createNew({
      username: dto.username,
      email: dto.email,
      password_hash: passwordHash,
      role_id: dto.role_id,
      dept_id: dto.dept_id,
      position_id: dto.position_id,
    });

    const created = await this.userRepo.create(newUser);
    return created.toSafe();
  }

  async findAll() {
    const users = await this.userRepo.findAll();
    return users.map((u) => u.toSafe());
  }

  async findOne(
    id: number,
    requesterId: number,
    permissionScope: string,
  ): Promise<UserDetailDto> {
    this.assertOwnScope(permissionScope, requesterId, id);

    const userWithDetails = await this.userRepo.findDetailsById(id);
    if (!userWithDetails) {
      throw new NotFoundException(`Không tìm thấy user với id ${id}`);
    }

    return this.mapToDto(userWithDetails);
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    requesterId: number,
    permissionScope: string,
  ) {
    this.assertOwnScope(permissionScope, requesterId, id);
    const user = await this.findOneEntity(id);

    if (dto.username !== undefined) user.username = dto.username;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role_id !== undefined) user.role_id = dto.role_id;
    if (dto.dept_id !== undefined) user.dept_id = dto.dept_id;
    if (dto.position_id !== undefined) user.position_id = dto.position_id;
    user.updatedAt = new Date();

    await this.userRepo.update(id, user);

    if (dto.profile) {
      await this.userRepo.upsertProfile(id, dto.profile);
    }

    return this.findOne(id, requesterId, permissionScope);
  }

  /**
   * Cập nhật vị trí là một nghiệp vụ riêng với quyền `users:manage_position`.
   * Manager chỉ được thực hiện với nhân sự thuộc phòng ban do chính họ quản lý.
   */
  async updatePosition(
    id: number,
    dto: UpdateUserDto,
    requesterId: number,
    permissionScope: string,
  ) {
    const invalidFields = Object.entries(dto)
      .filter(([field, value]) => field !== 'position_id' && value !== undefined)
      .map(([field]) => field);
    console.log("DTO:", dto);
    console.log("Invalid fields:", invalidFields);
    if (invalidFields.length > 0 || dto.position_id === undefined) {
      throw new BadRequestException(
        'Chỉ được cập nhật trường position_id cho endpoint này.',
      );
    }

    const targetUser = await this.findOneEntity(id);

    if (permissionScope === 'own') {
      if (targetUser.dept_id === null) {
        throw new ForbiddenException(
          'Không thể thiết lập vị trí cho nhân sự chưa thuộc phòng ban nào.',
        );
      }

      const department = await this.departmentRepo.findById(targetUser.dept_id);
      if (!department) {
        throw new NotFoundException(
          `Không tìm thấy phòng ban với ID ${targetUser.dept_id}`,
        );
      }
      if (department.manager_id !== requesterId) {
        throw new ForbiddenException(
          'Chỉ trưởng phòng đang quản lý nhân sự này mới được cập nhật vị trí.',
        );
      }
    }

    if (dto.position_id !== null) {
      if (targetUser.dept_id === null) {
        throw new BadRequestException(
          'Nhân sự cần thuộc một phòng ban trước khi được gán vị trí.',
        );
      }

      const position = await this.positionRepo.findById(dto.position_id);
      if (!position) {
        throw new NotFoundException(`Không tìm thấy vị trí với ID ${dto.position_id}`);
      }
      if (position.dept_id !== targetUser.dept_id) {
        throw new BadRequestException(
          'Chỉ có thể gán vị trí thuộc cùng phòng ban với nhân sự.',
        );
      }
    }

    targetUser.position_id = dto.position_id;
    targetUser.updatedAt = new Date();
    return (await this.userRepo.update(id, targetUser)).toSafe();
  }

  async updateProfileImage(
    userId: number,
    imageUrl: string,
    type: 'avatar' | 'cover',
    requesterId: number,
    permissionScope: string,
  ) {
    // Thêm dòng này để kiểm tra quyền
    this.assertOwnScope(permissionScope, requesterId, userId);
    await this.userRepo.upsertProfile(userId, {
      [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: imageUrl,
    });
  }

  async activate(id: number) {
    const user = await this.findOneEntity(id);
    user.activate();
    const updated = await this.userRepo.update(id, user);
    return updated.toSafe();
  }

  async deactivate(id: number) {
    const user = await this.findOneEntity(id);
    user.deactivate();
    const updated = await this.userRepo.update(id, user);
    return updated.toSafe();
  }

  private async findOneEntity(id: number): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với id ${id}`);
    }
    return user;
  }

  private assertOwnScope(
    permissionScope: string,
    requesterId: number,
    targetUserId: number,
  ) {
    if (permissionScope === 'own' && requesterId !== targetUserId) {
      throw new ForbiddenException(
        'Chỉ được thao tác trên tài khoản của chính mình.',
      );
    }
  }

  private mapToDto(user: UserWithDetails): UserDetailDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      profile: user.profile
        ? {
          full_name: user.profile.full_name,
          avatarUrl: user.profile.avatarUrl,
          coverUrl: user.profile.coverUrl,
          email: user.profile.email,
          dob: user.profile.dob,
          address: user.profile.address,
          phone: user.profile.phone,
        }
        : null,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      department: user.department
        ? { id: user.department.id, name: user.department.name }
        : null,
      position: user.position
        ? { id: user.position.id, title: user.position.title }
        : null,
    };
  }
}
