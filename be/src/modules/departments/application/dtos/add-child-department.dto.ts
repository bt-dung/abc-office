import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class AddChildDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsOptional()
  manager_id?: number | null;
}