import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRoutineExerciseDto } from './create-routine-exercise.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '@prisma/client';

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

  @IsEnum(DayType)
  @IsOptional()
  @ApiPropertyOptional({ enum: DayType, example: DayType.PUSH })
  type?: DayType;

  @ValidateNested({ each: true })
  @Type(() => CreateRoutineExerciseDto)
  @ApiProperty({ type: [CreateRoutineExerciseDto] })
  routineExercises!: CreateRoutineExerciseDto[];
}
