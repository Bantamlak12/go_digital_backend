import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { Admins } from '../auth/entities/admin.entity';
import { ResetTokens } from 'src/auth/entities/password-reset-token.entity';
import { RecoveryTokens } from 'src/auth/entities/account-recovery-token.entity';
import { Blogs } from 'src/blogs/entities/blogs.entity';

@Module({
  // This is the line that create the Repository
  imports: [
    TypeOrmModule.forFeature([Admins, ResetTokens, RecoveryTokens, Blogs]),
    forwardRef(() => AuthModule),
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
