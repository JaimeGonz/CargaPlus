import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { Injectable } from '@nestjs/common';
import { Prisma, WorkoutSet } from '@prisma/client';

@Injectable()
export class WorkoutSetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // async create(sessionId: number, dto: CreateWorkoutSetDto) {
  //   const existingSetsCount = await this.prisma.workoutSet.count({
  //     where: { sessionId, exerciseId: dto.exerciseId },
  //   });

  //   const order = existingSetsCount + 1;

  //   return this.prisma.workoutSet.create({
  //     data: { ...dto, sessionId, order },
  //   });
  // }

  async create(
    sessionId: number,
    dto: CreateWorkoutSetDto,
    attempt = 0,
  ): Promise<WorkoutSet> {
    const existingSetsCount = await this.prisma.workoutSet.count({
      where: { sessionId, exerciseId: dto.exerciseId },
    });

    const order = existingSetsCount + 1;

    try {
      return await this.prisma.workoutSet.create({
        data: { ...dto, sessionId, order },
      });
    } catch (e) {
      // Si petición entra con el mismo "order" — reintenta con el conteo actualizado
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        attempt < 3
      ) {
        return this.create(sessionId, dto, attempt + 1);
      }
      throw e;
    }
  }

  async findAllBySession(sessionId: number) {
    return this.prisma.workoutSet.findMany({
      where: { sessionId },
      orderBy: { order: 'asc' },
    });
  }

  async findOneBySession(id: number, sessionId: number) {
    return this.prisma.workoutSet.findFirst({ where: { id, sessionId } });
  }

  async update(id: number, data: Prisma.WorkoutSetUpdateInput) {
    return this.prisma.workoutSet.update({
      where: { id },
      data: { ...data },
    });
  }

  async remove(id: number) {
    return this.prisma.workoutSet.delete({
      where: { id },
    });
  }

  async findPreviousSessionSets(userId: number, exerciseId: number) {
    const lastSet = await this.prisma.workoutSet.findFirst({
      where: { exerciseId, session: { userId, isCompleted: true } },
      orderBy: { session: { startTime: 'desc' } },
      select: { sessionId: true },
    });

    if (!lastSet) return [];

    return this.prisma.workoutSet.findMany({
      where: { exerciseId, sessionId: lastSet.sessionId },
      orderBy: { order: 'asc' },
      select: {
        order: true,
        weight: true,
        reps: true,
        rir: true,
        setType: true,
      },
    });
  }
}
