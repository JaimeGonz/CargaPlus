import { Injectable } from '@nestjs/common';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { WorkoutSessionsRepository } from './workout-sessions.repository';

@Injectable()
export class WorkoutSessionsService {
  constructor(
    private readonly workoutSessionsRepository: WorkoutSessionsRepository,
  ) {}

  async create(dto: CreateWorkoutSessionDto, userId: number) {
    return this.workoutSessionsRepository.create(dto, userId);
  }
}
