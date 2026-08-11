import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier!: string; // username hoặc email

  @IsString()
  @IsNotEmpty()
  password!: string;
}
