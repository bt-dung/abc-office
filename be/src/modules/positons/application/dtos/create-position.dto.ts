import {
    IsString,
    IsNotEmpty,
    IsInt,
    IsNumber,
    IsOptional,
} from 'class-validator';

export class CreatePositionDto {
    @IsString({ message: 'Tiêu đề phải là một chuỗi' })
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title!: string;

    @IsInt({ message: 'ID phòng ban phải là một số nguyên' })
    @IsNotEmpty({ message: 'ID phòng ban không được để trống' })
    dept_id!: number;

    @IsNumber({}, { message: 'Lương cơ bản phải là một số' })
    @IsOptional()
    base_salary?: number;
}