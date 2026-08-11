import { Department } from "../entities/department.entity";

export const I_DEPARTMENT_REPOSITORY = 'IDEPARTMENTREPOSITORY';

export interface IDepartmentRepository {
    findAll(): Promise<Department[]>;
    findById(id: number): Promise<Department | null>;
    create(department: Department): Promise<Department>;
    update(id: number, department: Department): Promise<Department>;
    dissolveDepartment(id: number): Promise<void>;
}
