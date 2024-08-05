import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { MailerConfigModule } from 'src/shared/mailer/mailer.module';
import { CustomeMailerService } from 'src/shared/mailer/mailer.service';
import { Admins } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Admins]), PassportModule, forwardRef(() => AdminModule), MailerConfigModule],
  providers: [AuthService, LocalStrategy, CustomeMailerService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
