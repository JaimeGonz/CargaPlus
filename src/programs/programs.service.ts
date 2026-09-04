import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { ProgramsRepository } from './programs.repository';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramStatus } from '@prisma/client';

@Injectable()
export class ProgramsService {
  constructor(private readonly programsRepository: ProgramsRepository) {}

  async create(dto: CreateProgramDto, userId: number) {
    return await this.programsRepository.create(dto, userId);
  }

  async findAll(userId: number, includeArchived?: boolean) {
    return await this.programsRepository.findAll(userId, includeArchived);
  }

  async findOne(id: number, userId: number) {
    const program = await this.programsRepository.findOne(id, userId);

    if (!program)
      throw new NotFoundException('Program not found for this user');

    return program;
  }

  async update(id: number, userId: number, dto: UpdateProgramDto) {
    const program = await this.programsRepository.findOne(id, userId);

    if (!program)
      throw new NotFoundException('Program not found for this user');

    return await this.programsRepository.update(id, dto);
  }

  async activate(id: number, userId: number) {
    const program = await this.programsRepository.findOne(id, userId);
    if (!program) throw new NotFoundException('Program not found.');

    return this.programsRepository.activate(id, userId);
  }

  async deactivate(id: number, userId: number) {
    const program = await this.programsRepository.findOne(id, userId);
    if (!program) throw new NotFoundException('Program not found.');

    if (program.status !== ProgramStatus.ACTIVE)
      throw new BadRequestException(
        'Only an active program can be deactivated.',
      );

    return this.programsRepository.deactivate(id);
  }

  async archive(id: number, userId: number) {
    const program = await this.programsRepository.findOne(id, userId);
    if (!program) throw new NotFoundException('Program not found');

    if (program.status === ProgramStatus.ARCHIVED) {
      throw new BadRequestException('The program is already archived.');
    }

    return this.programsRepository.archive(id);
  }
}
