import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExercisesService } from './exercises.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
    @GetUser('userId') userId: number,
  ) {
    return await this.exercisesService.create(
      createExerciseDto.name,
      createExerciseDto.muscleGroup,
      createExerciseDto.equipment,
      createExerciseDto.description,
      userId,
    );
  }

  @Get()
  async findAll(@GetUser('userId') userId: number) {
    return await this.exercisesService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedData: UpdateExerciseDto,
  ) {
    return await this.exercisesService.update(Number(id), updatedData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.exercisesService.remove(Number(id));
  }
}
