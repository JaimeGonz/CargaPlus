import { Module } from '@nestjs/common';
import { WorkoutSetsController } from './workout-sets.controller';
import { WorkoutSetsService } from './workout-sets.service';
import { WorkoutSetsRepository } from './workout-sets.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkoutSessionsModule } from 'src/workout-sessions/workout-sessions.module';

@Module({
  imports: [PrismaModule, WorkoutSessionsModule],
  controllers: [WorkoutSetsController],
  providers: [WorkoutSetsService, WorkoutSetsRepository],
})
export class WorkoutSetsModule {}
