import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SplitType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Programa A' })
  name!: string;

  @IsOptional()
  @IsEnum(SplitType)
  @ApiPropertyOptional({ enum: SplitType, example: SplitType.HYBRID })
  splitType?: SplitType;
}
