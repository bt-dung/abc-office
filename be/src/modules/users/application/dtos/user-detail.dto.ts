import { UserStatus } from '@prisma/client';

class ProfileDto {
    full_name!: string;
    avatarUrl!: string | null;
    coverUrl!: string | null;
    email!: string | null;
    dob!: Date | null;
    address!: string | null;
    phone!: string | null;
}
class RelatedObjectDto {
    id!: number;
    name!: string;
}
class PositionDto {
    id!: number;
    title!: string;
}

export class UserDetailDto {
    id!: number;
    username!: string;
    email!: string;
    status!: UserStatus;
    role!: RelatedObjectDto;
    profile!: ProfileDto | null;
    department!: RelatedObjectDto | null;
    position!: PositionDto | null;
}
