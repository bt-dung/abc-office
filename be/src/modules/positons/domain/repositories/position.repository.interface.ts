import { Position } from '../entities/position.entity';

export const I_POSITION_REPOSITORY = 'I_POSITION_REPOSITORY';

export interface IPositionRepository {
    create(position: Position): Promise<Position>;
    update(id: number, position: Position): Promise<Position>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<Position | null>;
    findAll(): Promise<Position[]>;
    findByDepartmentId(dept_id: number): Promise<Position[]>; // <-- Nghiệp vụ của bạn nằm ở đây
}

