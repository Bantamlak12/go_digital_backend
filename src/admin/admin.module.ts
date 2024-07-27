import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { Admins } from '../auth/entities/auth.entity';
import { PasswordResetTokens } from 'src/auth/entities/password-reset-token.entity';

@Module({
  // This is the line that create the Repository
  imports: [
    TypeOrmModule.forFeature([Admins, PasswordResetTokens]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
