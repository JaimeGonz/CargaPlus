import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutSetDto } from './create-workout-set.dto';

export class UpdateWorkoutSetDto extends PartialType(CreateWorkoutSetDto) {}
