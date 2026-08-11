import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { UserStatus } from '@prisma/client';
export { UserStatus };

const PASSWORD_SALT_ROUNDS = 10;

export class User {
  public readonly id: number | null;
  public username: string;
  public email: string;
  // `private` chỉ chặn lúc biên dịch, field vẫn bị serialize lúc runtime nếu không có @Exclude()
  @Exclude()
  private password_hash: string;
  public status: UserStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  // Foreign Keys
  public role_id: number;
  public dept_id: number | null;
  public position_id: number | null;

  constructor(props: {
    id: number | null;
    username: string;
    email: string;
    password_hash?: string; // Make optional to support creating entities from partial data
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    role_id: number;
    dept_id?: number | null;
    position_id?: number | null;
  }) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.password_hash = props.password_hash ?? ''; // Default to empty string if not provided
    this.status = props.status ?? UserStatus.PENDING;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.role_id = props.role_id;
    this.dept_id = props.dept_id ?? null;
    this.position_id = props.position_id ?? null;
  }

  public static createNew(props: {
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
    dept_id?: number | null;
    position_id?: number | null;
  }): User {
    const now = new Date();
    return new User({
      id: null,
      username: props.username,
      email: props.email,
      password_hash: props.password_hash,
      status: UserStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      role_id: props.role_id,
      dept_id: props.dept_id,
      position_id: props.position_id,
    });
  }

  public async validatePassword(password: string): Promise<boolean> {
    if (!this.password_hash) {
      return false; // Cannot validate if there is no hash
    }
    return bcrypt.compare(password, this.password_hash);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  // Chỉ dùng nội bộ bởi repository khi ghi xuống DB, không expose qua API
  public getPasswordHash(): string {
    return this.password_hash;
  }

  // Trả về dữ liệu an toàn để expose ra ngoài API, không bao giờ lộ password_hash
  public toSafe() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      status: this.status,
      role_id: this.role_id,
      dept_id: this.dept_id,
      position_id: this.position_id,
    };
  }

  // Thay đổi trạng thái
  public suspend() {
    this.status = UserStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  public activate() {
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  public deactivate() {
    this.status = UserStatus.INACTIVE;
    this.updatedAt = new Date();
  }
}