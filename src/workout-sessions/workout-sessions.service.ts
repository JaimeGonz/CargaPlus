import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { WorkoutSessionsRepository } from './workout-sessions.repository';
import { FinishWorkoutSessionDto } from './dto/finish-workout-session.dto';

@Injectable()
export class WorkoutSessionsService {
  constructor(
    private readonly workoutSessionsRepository: WorkoutSessionsRepository,
  ) {}

  async create(dto: CreateWorkoutSessionDto, userId: number) {
    return this.workoutSessionsRepository.create(dto, userId);
  }

  async findAll(userId: number) {
    return this.workoutSessionsRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    return this.workoutSessionsRepository.findOne(id, userId);
  }

  async update(id: number, userId: number, dto: FinishWorkoutSessionDto) {
    const session = await this.findOne(id, userId);

    if (!session) throw new NotFoundException('Session not found.');

    if (session.isCompleted)
      throw new BadRequestException('This session is already finished.');

    return this.workoutSessionsRepository.update(id, {
      ...dto,
      endTime: new Date(),
      isCompleted: true,
    });
  }
}
