import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Admins } from '../auth/entities/admin.entity';
import { ResetTokens } from 'src/auth/entities/password-reset-token.entity';
import { RecoveryTokens } from 'src/auth/entities/account-recovery-token.entity';
import { Comments, CommentStatus } from 'src/blogs/entities/comment.entity';
import { Blogs } from 'src/blogs/entities/blogs.entity';

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
  // GENERAL METHODS USED TO PERFORM ACTIONS ON A REPOSITORY
  /*********************************************************************/
  // It creates entries to the database
  async create<T>(repository: Repository<T>, body: any): Promise<T[]> {
    const res = repository.create(body);
    return await repository.save(res);
  }

  // Creates a blog
  async createBlog(
    blogRepo: Repository<Blogs>,
    commentRepo: Repository<Comments>,
    blogId: string,
    body: any,
  ): Promise<Comments> {
    const { firstName, lastName, content } = body;

    const blog = await blogRepo.findOne({ where: { id: blogId } });

    if (!blog) {
      throw new NotFoundException('Blog is not found.');
    }

    // Create a new comment
    const comment = commentRepo.create({
      firstName,
      lastName,
      content,
      blog,
    });
    return await commentRepo.save(comment);
  }

  // It get a single data from a database
  async getAll<T>(repository: Repository<T>): Promise<T[]> {
    const res = await repository.find();
    return res;
  }

  // It get all comments related to the blog post
  async getAllBlogComments(
    repository: Repository<Comments>,
    blogId: string,
  ): Promise<Comments[]> {
    try {
      const res = await repository.find({
        where: {
          blog: { id: blogId } as any,
        },
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  // It get all approved comments related to the blog post
  async getAllApprovedBlogComments(
    repository: Repository<Comments>,
    blogId: string,
  ): Promise<Comments[]> {
    try {
      const res = await repository.find({
        where: {
          status: CommentStatus.APPROVED,
          blog: { id: blogId } as any,
        },
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  // It get a specific comment that belong to a blog
  async getComment(
    repository: Repository<Comments>,
    blogId: string,
    commentId: string,
  ): Promise<Comments> {
    try {
      const res = await repository.findOne({
        where: [{ id: blogId }, { id: commentId }],
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  // It get all data from database
  async getOne<T>(repository: Repository<T>, id: string): Promise<T | null> {
    const res = await repository.findOneBy({ id } as any);
    return res;
  }

  // It updates data in a database
  async getUpdate<T>(
    repository: Repository<T>,
    id: string,
    body: any,
  ): Promise<T | null> {
    try {
      await repository.update(id, body);
      return await repository.findOneBy({ id } as any);
    } catch (err) {
      throw err;
    }
  }

  async findByEmail<T>(repository: Repository<T>, email: string): Promise<T[]> {
    try {
      const where: FindOptionsWhere<T> = {
        email,
      } as any;
      return await repository.find({ where });
    } catch (err) {
      throw err;
    }
  }

  async findById<T>(repository: Repository<T>, id: string): Promise<T> {
    try {
      return await repository.findOneBy({ id } as any);
    } catch (err) {
      throw err;
    }
  }

  // Find by IDs
  async findByIds<T>(repository: Repository<T>, ids: string[]): Promise<T[]> {
    try {
      const where: FindOptionsWhere<T> = {
        id: In(ids),
      } as any;
      const result = await repository.find({ where });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete<T>(repository: Repository<T>, id: string): Promise<void> {
    try {
      const instance = await this.findById(repository, id);

      await repository.remove(instance);
    } catch (err) {
      throw err;
    }
  }
}
