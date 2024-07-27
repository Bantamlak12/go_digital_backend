import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomeMailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [CustomeMailerService],
  exports: [CustomeMailerService],
})
export class MailerConfigModule {}
