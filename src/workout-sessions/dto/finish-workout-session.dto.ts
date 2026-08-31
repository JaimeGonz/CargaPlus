import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FinishWorkoutSessionDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Buena sesión, terminé cansado.' })
  notes?: string;
}
