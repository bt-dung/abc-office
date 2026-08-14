import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class ChangeManagerDto {
    @IsInt({ message: 'manager_id phải là một số nguyên' })
    @ValidateIf((o) => o.manager_id !== null)
    manager_id?: number | null;
}