import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../reviewer/user.entity';
import { CompanyEntity } from '../reviewer/company.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import { JobEntity } from '../reviewer/job.entity';
import { JobCategoryEntity } from '../reviewer/job_category.entity';
import { ApplicationEntity } from '../reviewer/application.entity';
import { AssignedJobEntity } from '../reviewer/assigned_job.entity';
import { PaymentEntity } from '../reviewer/payment.entity';
import { RatingReviewEntity } from '../reviewer/rating_review.entity';
import { ReportEntity } from '../reviewer/report.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      EmployeeEntity,
      JobEntity,
      JobCategoryEntity,
      ApplicationEntity,
      AssignedJobEntity,
      PaymentEntity,
      RatingReviewEntity,
      ReportEntity,
    ]),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
