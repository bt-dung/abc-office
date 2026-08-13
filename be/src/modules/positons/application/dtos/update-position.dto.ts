import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdatePositionDto {
    @IsString({ message: 'Tiêu đề phải là một chuỗi' })
    @IsOptional()
    title?: string;

    @IsInt({ message: 'ID phòng ban phải là một số nguyên' })
    @IsOptional()
    dept_id?: number;

    @IsNumber({}, { message: 'Lương cơ bản phải là một số' })
    @IsOptional()
    base_salary?: number;
}