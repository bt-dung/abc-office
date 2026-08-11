import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestUser } from '../../domain/types/request-user.type';

const REFRESH_TOKEN_BYTES = 64;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.identifier }, { email: dto.identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        `Tài khoản đang ở trạng thái ${user.status}, không thể đăng nhập.`,
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.pw);
    if (!passwordMatches) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu.');
    }

    const tokens = await this.issueTokens(user.id);
    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
        role_id: user.role_id,
        dept_id: user.dept_id,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === dto.username) {
        throw new UnauthorizedException(`Tên đăng nhập "${dto.username}" đã được sử dụng.`);
      }
      if (existingUser.email === dto.email) {
        throw new UnauthorizedException(`Email "${dto.email}" đã được sử dụng.`);
      }
    }

    const userRole = await this.prisma.role.findUnique({
      where: { name: 'USER' },
    });
    console.log(userRole);

    if (!userRole) {
      console.error('Default role "User" not found in database.');
      throw new Error('Lỗi cấu hình hệ thống, không thể tạo tài khoản.');
    }

    const pw = await bcrypt.hash(dto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        pw,
        role_id: userRole.id,
        dept_id: null,
      },
    });

    const tokens = await this.issueTokens(newUser.id);
    return {
      ...tokens,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        status: newUser.status,
        role_id: newUser.role_id,
        dept_id: newUser.dept_id,
      },
    };
  }

  async refresh(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const record = await this.prisma.refreshToken.findUnique({
      where: { token_hash: tokenHash },
    });

    if (!record || record.revoked_at || record.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token không hợp lệ.');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revoked_at: new Date() },
    });

    return this.issueTokens(record.user_id);
  }

  async logout(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { token_hash: tokenHash, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  async logoutAll(userId: number): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  async getAuthContext(userId: number): Promise<RequestUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!user || !user.role) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      roleName: user.role.name,
      dept_id: user.dept_id,
      permissions: user.role.permissions.map((rp) => ({
        name: rp.permission.name,
        scope: rp.scope,
      })),
    };
  }

  private async issueTokens(userId: number) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES ??
          '15m') as JwtSignOptions['expiresIn'],
      },
    );

    const rawRefreshToken = randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const refreshExpiresDays = Number(
      process.env.JWT_REFRESH_EXPIRES_DAYS ?? '7',
    );
    const expiresAt = new Date(
      Date.now() + refreshExpiresDays * 24 * 60 * 60 * 1000,
    );

    await this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: this.hashToken(rawRefreshToken),
        expires_at: expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
