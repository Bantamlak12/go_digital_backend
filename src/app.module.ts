import { Module } from '@nestjs/common';
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

@Module({
  imports: [AdminModule, AuthModule, BlogModule, BookingModule, ContactModule, ServicesModule, TestimonialsModule, VacanciesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
