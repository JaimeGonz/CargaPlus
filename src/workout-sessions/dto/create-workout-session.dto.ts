import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkoutSessionDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  routineId?: number;
}
