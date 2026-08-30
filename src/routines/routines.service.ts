import { Injectable } from '@nestjs/common';
import { RoutinesRepository } from './routines.repository';
import { CreateRoutineDto } from './dto/create-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(private readonly routinesRepository: RoutinesRepository) {}

  async create(createRoutineDto: CreateRoutineDto, userId: number) {
    return this.routinesRepository.create(createRoutineDto, userId);
  }

  async findOne(id: number, userId: number) {
    return this.routinesRepository.findOne(id, userId);
  }

  async findAll(userId: number) {
    return this.routinesRepository.findAll(userId);
  }
}
