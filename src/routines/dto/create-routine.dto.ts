import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRoutineExerciseDto } from './create-routine-exercise.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Push Day - Pecho y Tríceps' })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Rutina enfocada en fuerza para empuje' })
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ example: 1, description: '1 = lunes ... 7 = domingo' })
  dayOfWeek?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Torso-pierna' })
  type?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineExerciseDto)
  @ApiProperty({ type: [CreateRoutineExerciseDto] })
  routineExercises!: CreateRoutineExerciseDto[];
}
