import { User as PrismaUser } from '@prisma/client';
import { User } from './user.entity';

export class UserMapper {
    public static toDomain(raw: Partial<PrismaUser>): User {
        const { id, username, email, pw, status, createdAt, updatedAt, role_id, dept_id, position_id } = raw;

        if (!username || !email || !status || !createdAt || !updatedAt || !role_id) {
            throw new Error('Dữ liệu không đầy đủ để tạo User entity. Các trường bắt buộc: username, email, status, createdAt, updatedAt, role_id.');
        }

        return new User({
            id: id ?? null,
            username,
            email,
            password_hash: pw,
            status,
            createdAt,
            updatedAt,
            role_id,
            dept_id,
            position_id
        });
    }

    public static toPersistence(user: User): Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'> {
        return {
            username: user.username,
            email: user.email,
            pw: user.getPasswordHash(),
            status: user.status,
            role_id: user.role_id,
            dept_id: user.dept_id,
            position_id: user.position_id,
        };
    }
}