import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { Program, ProgramStatus } from '@prisma/client';

@Injectable()
export class ProgramsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProgramDto, userId: number): Promise<Program> {
    return await this.prisma.program.create({
      data: { ...dto, userId },
    });
  }

  async findOne(id: number, userId: number): Promise<Program | null> {
    return await this.prisma.program.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: number, includeArchived?: boolean): Promise<Program[]> {
    return await this.prisma.program.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { status: { not: ProgramStatus.ARCHIVED } }),
      },
    });
  }
}
