import {
  IsNotEmpty,
  IsNumber,
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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Torso-pierna' })
  type?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 4 })
  weeklyFrequency?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineExerciseDto)
  @ApiProperty({ type: [CreateRoutineExerciseDto] })
  routineExercises!: CreateRoutineExerciseDto[];
}
