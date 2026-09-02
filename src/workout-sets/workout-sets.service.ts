import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { WorkoutSetsRepository } from './workout-sets.repository';
import { WorkoutSessionsService } from 'src/workout-sessions/workout-sessions.service';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';

@Injectable()
export class WorkoutSetsService {
  constructor(
    private readonly workoutSetsRepository: WorkoutSetsRepository,
    private readonly workoutSessionsService: WorkoutSessionsService,
  ) {}

  async create(sessionId: number, userId: number, dto: CreateWorkoutSetDto) {
    const session = await this.workoutSessionsService.findOne(
      sessionId,
      userId,
    );

    if (!session) throw new NotFoundException('Workout session not found.');

    if (session.isCompleted) {
      throw new BadRequestException('Cannot add sets to a finished session.');
    }

    return this.workoutSetsRepository.create(sessionId, dto);
  }

  async findAllBySession(sessionId: number, userId: number) {
    const session = await this.workoutSessionsService.findOne(
      sessionId,
      userId,
    );

    if (!session) throw new NotFoundException('Workout session not found.');

    return this.workoutSetsRepository.findAllBySession(sessionId);
  }

  async update(
    id: number,
    sessionId: number,
    userId: number,
    dto: UpdateWorkoutSetDto,
  ) {
    const session = await this.workoutSessionsService.findOne(
      sessionId,
      userId,
    );

    if (!session) throw new NotFoundException('Workout session not found.');

    const set = await this.workoutSetsRepository.findOneBySession(
      id,
      sessionId,
    );

    if (!set)
      throw new NotFoundException('Workout set not found in this session.');

    return this.workoutSetsRepository.update(id, dto);
  }
}
