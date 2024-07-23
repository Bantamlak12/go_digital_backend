import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { Admin } from '../auth/auth.entity';

@Module({
  // This is the line that create the Repository
  imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => AuthModule)],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
