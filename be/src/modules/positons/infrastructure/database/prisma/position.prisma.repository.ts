import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPositionRepository } from '../../../domain/repositories/position.repository.interface';
import { Position } from '../../../domain/entities/position.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaPositionRepository implements IPositionRepository {
    constructor(private readonly prisma: PrismaService) { }

    private toDomain(prismaPosition: Prisma.PositionGetPayload<{}>): Position {
        return new Position(
            prismaPosition.id,
            prismaPosition.title,
            prismaPosition.dept_id,
            prismaPosition.base_salary,
        );
    }

    private toPrisma(position: Position): Prisma.PositionCreateInput | Prisma.PositionUpdateInput {
        return {
            title: position.title,
            dept_id: position.dept_id,
            base_salary: position.base_salary,
        };
    }

    async create(position: Position): Promise<Position> {
        const createdPosition = await this.prisma.position.create({
            data: this.toPrisma(position) as Prisma.PositionCreateInput,
        });
        return this.toDomain(createdPosition);
    }

    async update(id: number, position: Position): Promise<Position> {
        const updatedPosition = await this.prisma.position.update({
            where: { id },
            data: this.toPrisma(position),
        });
        return this.toDomain(updatedPosition);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.position.delete({ where: { id } });
    }

    async findById(id: number): Promise<Position | null> {
        const prismaPosition = await this.prisma.position.findUnique({
            where: { id },
        });
        return prismaPosition ? this.toDomain(prismaPosition) : null;
    }

    async findAll(): Promise<Position[]> {
        const prismaPositions = await this.prisma.position.findMany();
        return prismaPositions.map(this.toDomain);
    }

    async findByDepartmentId(dept_id: number): Promise<Position[]> {
        const prismaPositions = await this.prisma.position.findMany({
            where: { dept_id },
        });
        return prismaPositions.map(this.toDomain);
    }
}