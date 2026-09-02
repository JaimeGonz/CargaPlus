import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkoutSetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sessionId: number, dto: CreateWorkoutSetDto) {
    const existingSetsCount = await this.prisma.workoutSet.count({
      where: { sessionId },
    });

    const order = existingSetsCount + 1;

    return this.prisma.workoutSet.create({
      data: { ...dto, sessionId, order },
    });
  }

  async findAllBySession(sessionId: number) {
    return this.prisma.workoutSet.findMany({
      where: { sessionId },
      orderBy: { order: 'asc' },
    });
  }
}
