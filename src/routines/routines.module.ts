import { Module } from '@nestjs/common';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';
import { RoutinesRepository } from './routines.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoutinesController],
  providers: [RoutinesService, RoutinesRepository],
})
export class RoutinesModule {}
