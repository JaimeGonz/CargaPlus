import { Module } from '@nestjs/common';
import { WorkoutSessionsController } from './workout-sessions.controller';
import { WorkoutSessionsService } from './workout-sessions.service';
import { WorkoutSessionsRepository } from './workout-sessions.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutSessionsController],
  providers: [WorkoutSessionsService, WorkoutSessionsRepository],
})
export class WorkoutSessionsModule {}
