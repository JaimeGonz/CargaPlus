import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from './exercises.repository';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesRepository: ExercisesRepository) {}

  async create(
    name: string,
    muscleGroup: string,
    equipment?: string,
    description?: string,
    userId?: number,
  ) {
    return await this.exercisesRepository.create(
      name,
      muscleGroup,
      equipment,
      description,
      userId,
    );
  }

  async findAll(userId: number) {
    return await this.exercisesRepository.findAll(userId);
  }

  async update(id: number, updatedData: UpdateExerciseDto) {
    return await this.exercisesRepository.update(id, updatedData);
  }

  async remove(id: number) {
    return await this.exercisesRepository.remove(id);
  }
}
