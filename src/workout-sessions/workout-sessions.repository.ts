import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';

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
}
