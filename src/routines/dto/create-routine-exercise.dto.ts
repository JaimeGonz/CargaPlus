import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoutineExerciseDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  exerciseId!: number;

  @IsNumber()
  @ApiProperty({ example: 4 })
  sets!: number;

  @IsNumber()
  @ApiProperty({ example: 8 })
  repsMin!: number;

  @IsNumber()
  @ApiProperty({ example: 12 })
  repsMax!: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  order!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Enfocarse en la tecnica' })
  notes?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 2 })
  rir?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 90 })
  restSeconds?: number;
}
