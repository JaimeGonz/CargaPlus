import { Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoutinesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoutineDto: CreateRoutineDto, userId: number) {
    return await this.prismaService.routine.create({
      data: {
        name: createRoutineDto.name,
        description: createRoutineDto.description,
        type: createRoutineDto.type,
        userId,
        weeklyFrequency: createRoutineDto.weeklyFrequency,
        routineExercises: {
          create: createRoutineDto.routineExercises,
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prismaService.routine.findFirst({
      where: { id, userId },
      include: { routineExercises: true },
    });
  }

  async findAll(userId: number) {
    return this.prismaService.routine.findMany({
      where: { userId },
    });
  }
}
