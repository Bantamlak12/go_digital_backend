import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blogs/blog.module';
import { BookingModule } from './booking/booking.module';
import { ContactModule } from './contact/contact.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { Admins } from './auth/entities/admin.entity';
import { ResetTokens } from 'src/auth/entities/password-reset-token.entity';
import { RecoveryTokens } from 'src/auth/entities/account-recovery-token.entity';
import { MailerConfigModule } from './shared/mailer/mailer.module';
import { Blogs } from './blogs/entities/blogs.entity';
import { Comments } from './blogs/entities/comment.entity';
import { Categories } from './blogs/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [
          Admins,
          ResetTokens,
          RecoveryTokens,
          Blogs,
          Comments,
          Categories,
        ],
        synchronize: process.env.NODE_ENV !== 'development' ? false : true,
        ssl:
          config.get<string>('NODE_ENV') !== 'development'
            ? { rejectUnauthorized: true }
            : false,
      }),
    }),
    AdminModule,
    AuthModule,
    BlogModule,
    BookingModule,
    ContactModule,
    VacanciesModule,
    MailerConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
