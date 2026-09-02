import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { WorkoutSetsService } from './workout-sets.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-sessions')
export class WorkoutSetsController {
  constructor(private readonly workoutSetsService: WorkoutSetsService) {}

  @Post(':sessionId/sets')
  async create(
    @Param('sessionId') sessionId: string,
    @Body() createWorkoutSetDto: CreateWorkoutSetDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.workoutSetsService.create(
      Number(sessionId),
      userId,
      createWorkoutSetDto,
    );
  }

  @Get(':sessionId/sets')
  async findAllBySession(
    @Param('sessionId') sessionId: string,
    @GetUser('userId') userId: number,
  ) {
    return await this.workoutSetsService.findAllBySession(
      Number(sessionId),
      userId,
    );
  }

  @Patch(':sessionId/sets/:setId')
  async update(
    @Param('sessionId') sessionId: string,
    @Param('setId') setId: string,
    @Body() updateWorkoutSetDto: UpdateWorkoutSetDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.workoutSetsService.update(
      Number(setId),
      Number(sessionId),
      userId,
      updateWorkoutSetDto,
    );
  }
}
