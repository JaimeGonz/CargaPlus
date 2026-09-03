import { Module } from '@nestjs/common';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';
import { RoutinesRepository } from './routines.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports: [PrismaModule, ProgramsModule],
  controllers: [RoutinesController],
  providers: [RoutinesService, RoutinesRepository],
})
export class RoutinesModule {}
