import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutSetDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  exerciseId!: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 60 })
  weight?: number;

  @IsNumber()
  @ApiProperty({ example: 12 })
  reps!: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  rir?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Me costó trabajo, bajar peso en la próxima sesión. ',
  })
  notes?: string;
}
