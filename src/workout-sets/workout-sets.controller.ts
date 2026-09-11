import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkoutSetDto } from './dto/create-workout-set.dto';
import { WorkoutSetsService } from './workout-sets.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateWorkoutSetDto } from './dto/update-workout-set.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-sessions')
export class WorkoutSetsController {
  constructor(private readonly workoutSetsService: WorkoutSetsService) {}

  @Get('sets/previous')
  @ApiOperation({
    summary:
      'Get all sets from the most recent session that included this exercise',
  })
  @ApiQuery({ name: 'exerciseId', required: true })
  findPrevious(
    @Query('exerciseId') exerciseId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.workoutSetsService.findPreviousSessionSets(
      userId,
      Number(exerciseId),
    );
  }

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

  @Delete(':sessionId/sets/:setId')
  async remove(
    @Param('sessionId') sessionId: string,
    @Param('setId') setId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.workoutSetsService.remove(
      Number(setId),
      Number(sessionId),
      userId,
    );
  }
}
