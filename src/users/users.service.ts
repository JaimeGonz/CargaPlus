import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(email: string, hashedPassword: string, name: string) {
    return await this.repository.create(email, hashedPassword, name);
  }

  async findByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }
}
