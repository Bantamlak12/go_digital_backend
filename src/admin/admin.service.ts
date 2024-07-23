import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../auth/auth.entity';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private repo: Repository<Admin>) {}

  create(email: string, password: string): Promise<Admin> {
    const admin = this.repo.create({ email, password });

    return this.repo.save(admin);
  }

  async find(email: string): Promise<Admin[]> {
    return await this.repo.find({ where: { email } });
  }

  async findById(id: string): Promise<Admin> {
    return await this.repo.findOne({ where: { id } });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.repo.update({ id }, { password });
  }
}
