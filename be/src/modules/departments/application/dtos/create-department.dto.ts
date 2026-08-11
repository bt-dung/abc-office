import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsOptional()
    parent_id?: number | null;

    @IsNumber()
    @IsOptional()
    manager_id?: number | null;
}
