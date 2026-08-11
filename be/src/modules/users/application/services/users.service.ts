import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { I_USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type {
  IUserRepository,
  UserWithDetails,
} from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDetailDto } from '../dtos/user-detail.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly prisma: PrismaService,
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

    const updatedUser = await this.userRepo.update(id, user);

    if (dto.profile) {
      await this.prisma.profile.upsert({
        where: { user_id: id },
        update: {
          full_name: dto.profile.full_name,
          phone: dto.profile.phone,
        },
        create: {
          user_id: id,
          full_name: dto.profile.full_name ?? '',
          phone: dto.profile.phone,
        },
      });
    }

    return this.findOne(id, requesterId, permissionScope);
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
    const fieldToUpdate = type === 'avatar' ? 'avatarUrl' : 'coverUrl';

    await this.prisma.profile.upsert({
      where: { user_id: userId },
      update: {
        [fieldToUpdate]: imageUrl,
      },
      create: {
        user_id: userId,
        full_name: '', // Sẽ được cập nhật sau bởi hàm update()
        [fieldToUpdate]: imageUrl,
      },
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
