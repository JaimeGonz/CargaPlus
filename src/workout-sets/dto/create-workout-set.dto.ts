import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SetType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsEnum(SetType)
  @ApiPropertyOptional({ enum: SetType, example: SetType.WARMUP })
  setType?: SetType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Me costó trabajo, bajar peso en la próxima sesión. ',
  })
  notes?: string;
}
