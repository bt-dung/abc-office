import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Za-z]/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ cái' })
  @Matches(/\d/, { message: 'Mật khẩu phải chứa ít nhất 1 chữ số' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
  })
  password!: string;
  @IsString()
  phone!: string;

  @IsInt()
  role_id!: number;

  @IsInt()
  @IsOptional()
  dept_id?: number | null;

  @IsInt()
  @IsOptional()
  position_id?: number | null;
}
