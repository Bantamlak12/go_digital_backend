import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Admins } from '../auth/entities/admin.entity';
import { ResetTokens } from 'src/auth/entities/password-reset-token.entity';
import { RecoveryTokens } from 'src/auth/entities/account-recovery-token.entity';
import { title } from 'process';
import { Categories } from 'src/blogs/entities/category.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admins)
    private repo: Repository<Admins>,
    @InjectRepository(ResetTokens)
    private passwordResetTokenRepo: Repository<ResetTokens>,
    @InjectRepository(RecoveryTokens)
    private accountRecoveryTokenRepo: Repository<RecoveryTokens>,
  ) {}

  /*********************************************************************/
  // AUTHENTICATIN AND AUTHORIZATION RELATED METHODS
  /*********************************************************************/

  createAdmin(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<Admins> {
    const isActive = true;
    const createdAt = new Date();
    const admin = this.repo.create({
      firstName,
      lastName,
      email,
      password,
      isActive,
      createdAt,
    });

    return this.repo.save(admin);
  }

  async findByEmail(email: string): Promise<Admins[]> {
    return await this.repo.find({ where: { email } });
  }

  async findById(id: string): Promise<Admins> {
    return await this.repo.findOne({ where: { id } });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.repo.update({ id }, { password });
  }

  async updateIsActive(id: string, isActive: boolean) {
    const result = await this.repo.update({ id }, { isActive });
    return result;
  }

  async savePasswordResetToken(
    admin: Admins,
    resetToken: string,
    resetTokenExpiry: Date,
  ): Promise<ResetTokens> {
    const rToken = this.passwordResetTokenRepo.create({
      resetToken,
      resetTokenExpiry,
      admin,
    });
    await this.passwordResetTokenRepo.save(rToken);

    return rToken;
  }

  async saveAccountRecoveryToken(
    admin: Admins,
    recoveryToken: string,
    recoveryTokenExpiry: Date,
  ): Promise<RecoveryTokens> {
    const resetToken = this.accountRecoveryTokenRepo.create({
      recoveryToken,
      recoveryTokenExpiry,
      admin,
    });
    await this.accountRecoveryTokenRepo.save(resetToken);

    return resetToken;
  }

  async findAdminByResetToken(resetToken: string) {
    const rToken = await this.passwordResetTokenRepo.findOne({
      where: { resetToken },
      relations: ['admin'],
    });

    return rToken;
  }

  async findAdminByRecoveryToken(recoveryToken: string) {
    const rToken = await this.accountRecoveryTokenRepo.findOne({
      where: { recoveryToken },
      relations: ['admin'],
    });

    return rToken;
  }

  async clearPasswordResetToken(id: string): Promise<void> {
    await this.passwordResetTokenRepo.delete({ id });
  }

  async clearAccountRecoveryToken(id: string): Promise<void> {
    await this.accountRecoveryTokenRepo.delete({ id });
  }

  @Cron('0 0 * * 0')
  async cleanupExpiredResetTokens(): Promise<void> {
    const now = new Date();
    await this.passwordResetTokenRepo.delete({
      resetTokenExpiry: LessThan(now),
    });
  }

  @Cron('0 0 1 1,4,7,10 *')
  async cleanupExpiredRecoveryTokens(): Promise<void> {
    const now = new Date();
    await this.accountRecoveryTokenRepo.delete({
      recoveryTokenExpiry: LessThan(now),
    });
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

  /*********************************************************************/
  // BLOG RELATED METHODS
  /*********************************************************************/
  // It creates entries to the database
  async create<T>(repository: Repository<T>, body: any): Promise<T[]> {
    const res = repository.create(body);
    return await repository.save(res);
  }
  // It get a single data from a database
  async getAll<T>(repository: Repository<T>): Promise<T[]> {
    const res = await repository.find();
    return res;
  }

  // It get all data from database
  async getOne<T>(repository: Repository<T>, id: string): Promise<T | null> {
    const res = await repository.findOneBy({ id } as any);
    return res;
  }

  // It updates data in a database
  async getUpdate<T>(repository: Repository<T>, id: string, body: any) {
    await repository.update(id, body);
  }
}
