import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { MailerConfigModule } from 'src/mailer/mailer.module';
import { CustomeMailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [PassportModule, forwardRef(() => AdminModule), MailerConfigModule],
  providers: [AuthService, LocalStrategy, CustomeMailerService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
