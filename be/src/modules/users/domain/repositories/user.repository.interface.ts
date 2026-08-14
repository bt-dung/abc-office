import {
  User as PrismaUser,
  Role,
  Department,
  Position,
  Profile,
} from '@prisma/client';
import { User } from '../entities/user.entity';

export const I_USER_REPOSITORY = 'IUSERREPOSITORY';

export type ProfileChanges = {
  full_name?: string;
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
};

export type UserWithDetails = PrismaUser & {
  role: Role;
  department: Department | null;
  position: Position | null;
  profile: Profile | null;
};

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findDetailsById(id: number): Promise<UserWithDetails | null>;
  findByUsernameOrEmail(identifier: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, user: User): Promise<User>;
  upsertProfile(userId: number, changes: ProfileChanges): Promise<void>;
}
