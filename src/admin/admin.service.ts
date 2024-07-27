import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Admins } from '../auth/entities/auth.entity';
import { PasswordResetTokens } from 'src/auth/entities/password-reset-token.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admins)
    private repo: Repository<Admins>,
    @InjectRepository(PasswordResetTokens)
    private tokenRepo: Repository<PasswordResetTokens>,
  ) {}

  create(email: string, password: string): Promise<Admins> {
    const admin = this.repo.create({ email, password });

    return this.repo.save(admin);
  }

  async find(email: string): Promise<Admins[]> {
    return await this.repo.find({ where: { email } });
  }

  async findById(id: string): Promise<Admins> {
    return await this.repo.findOne({ where: { id } });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.repo.update({ id }, { password });
  }

  async savePasswordResetToken(
    admin: Admins,
    token: string,
    expiryTime: Date,
  ): Promise<PasswordResetTokens> {
    const resetToken = this.tokenRepo.create({
      token,
      expiryTime,
      admin,
    });
    await this.tokenRepo.save(resetToken);

    return resetToken;
  }

  async findAdminByToken(token: string) {
    const resetToken = await this.tokenRepo.findOne({
      where: { token },
      relations: ['admin'],
    });

    return resetToken;
  }

  async clearPasswordResetToken(id: number): Promise<void> {
    await this.tokenRepo.delete({ id });
  }

  @Cron('0 0 * * 0')
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.tokenRepo.delete({ expiryTime: LessThan(now) });
  }
}

// Note:
// * * * * * *
// | | | | | |
// | | | | | day of week(0-7 where 0 and 7 represents Sunday)
// | | | | months (0-12)
// | | | day of month(1-31)
// | | hours (0-23)
// | minutes (0-59)
// seconds (optional)
