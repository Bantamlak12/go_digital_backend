import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { BookingModule } from './booking/booking.module';
import { ContactModule } from './contact/contact.module';
import { ServicesModule } from './services/services.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { Admin } from './auth/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
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
        entities: [Admin],
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
    ServicesModule,
    TestimonialsModule,
    VacanciesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
