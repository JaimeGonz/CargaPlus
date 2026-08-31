import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutSessionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateWorkoutSessionDto, userId: number) {
    return this.prismaService.workoutSession.create({
      data: {
        userId,
        routineId: dto.routineId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prismaService.workoutSession.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prismaService.workoutSession.findFirst({
      where: { id, userId },
      include: { workoutSets: true },
    });
  }

  async update(id: number, data: Prisma.WorkoutSessionUpdateInput) {
    return this.prismaService.workoutSession.update({
      where: { id },
      data,
    });
  }
}
