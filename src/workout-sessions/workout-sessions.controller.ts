import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkoutSessionsService } from './workout-sessions.service';
import { CreateWorkoutSessionDto } from './dto/create-workout-session.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FinishWorkoutSessionDto } from './dto/finish-workout-session.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-sessions')
export class WorkoutSessionsController {
  constructor(
    private readonly workoutSessionsService: WorkoutSessionsService,
  ) {}

  @Post()
  async create(
    @Body() createWorkoutSessionDto: CreateWorkoutSessionDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.workoutSessionsService.create(
      createWorkoutSessionDto,
      userId,
    );
  }

  @Get()
  async findAll(@GetUser('userId') userId: number) {
    return await this.workoutSessionsService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Body() finishWorkoutSessionDto: FinishWorkoutSessionDto,
    @Param('id') id: string,
    @GetUser('userId') userId: number,
  ) {
    return await this.workoutSessionsService.update(
      Number(id),
      userId,
      finishWorkoutSessionDto,
    );
  }
}
