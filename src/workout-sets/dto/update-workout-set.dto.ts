import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateWorkoutSetDto } from './create-workout-set.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateWorkoutSetDto extends PartialType(CreateWorkoutSetDto) {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isCompleted?: boolean;
}
