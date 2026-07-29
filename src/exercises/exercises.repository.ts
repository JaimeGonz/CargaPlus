import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    name: string,
    muscleGroup: string,
    equipment?: string,
    description?: string,
    userId?: number,
  ) {
    return await this.prismaService.exercise.create({
      data: {
        name,
        muscleGroup,
        equipment,
        description,
        userId,
        isCustom: Boolean(userId),
      },
    });
  }

  async findAll(userId?: number) {
    return await this.prismaService.exercise.findMany({
      where: { OR: [{ userId: null }, { userId: userId }] },
    });
  }

  async update(id: number, updatedData: UpdateExerciseDto) {
    return await this.prismaService.exercise.update({
      where: { id: id },
      data: { ...updatedData },
    });
  }

  async remove(id: number) {
    return await this.prismaService.exercise.delete({ where: { id: id } });
  }
}
