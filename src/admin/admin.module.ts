import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity, UserCategory3Entity } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, UserCategory3Entity])], 
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}