import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutinesModule } from './routines/routines.module';
import { WorkoutSessionsModule } from './workout-sessions/workout-sessions.module';
import { WorkoutSetsModule } from './workout-sets/workout-sets.module';
import { ProgramsModule } from './programs/programs.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ExercisesModule,
    RoutinesModule,
    WorkoutSessionsModule,
    WorkoutSetsModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
