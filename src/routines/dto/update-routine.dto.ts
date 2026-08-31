import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateRoutineDto } from './create-routine.dto';

export class UpdateRoutineDto extends PartialType(
  OmitType(CreateRoutineDto, ['routineExercises'] as const),
) {}
