import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  IUserRepository,
  ProfileChanges,
  UserWithDetails,
} from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../../domain/entities/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => UserMapper.toDomain(u));
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findDetailsById(id: number): Promise<UserWithDetails | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        department: true,
        position: true,
        profile: true,
      },
    });
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const created = await this.prisma.user.create({
      data,
    });
    return UserMapper.toDomain(created);
  }

  async update(id: number, user: User): Promise<User> {
    // toPersistence trả về tất cả các trường, điều này phù hợp cho thao tác update.
    // Prisma sẽ chỉ cập nhật các trường được cung cấp trong đối tượng data.
    const data = UserMapper.toPersistence(user);
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    return UserMapper.toDomain(updated);
  }

  async upsertProfile(userId: number, changes: ProfileChanges): Promise<void> {
    await this.prisma.profile.upsert({
      where: { user_id: userId },
      update: changes,
      create: {
        user_id: userId,
        full_name: changes.full_name ?? '',
        phone: changes.phone,
        avatarUrl: changes.avatarUrl,
        coverUrl: changes.coverUrl,
      },
    });
  }
}
