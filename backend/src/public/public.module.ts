import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '../reviewer/job.entity';
import { JobCategoryEntity } from '../reviewer/job_category.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import { UserEntity } from '../reviewer/user.entity';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity, JobCategoryEntity, EmployeeEntity, UserEntity]),
  ],
  providers: [PublicService],
  controllers: [PublicController],
  exports: [PublicService],
})
export class PublicModule {}
