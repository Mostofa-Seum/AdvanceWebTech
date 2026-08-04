import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../reviewer/user.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import { CompanyEntity } from '../reviewer/company.entity';
import { JobEntity } from '../reviewer/job.entity';
import { JobCategoryEntity } from '../reviewer/job_category.entity';
import { ApplicationEntity } from '../reviewer/application.entity';
import { AssignedJobEntity } from '../reviewer/assigned_job.entity';
import { SubmissionEntity } from '../reviewer/submission.entity';
import { PaymentEntity } from '../reviewer/payment.entity';
import { RatingReviewEntity } from '../reviewer/rating_review.entity';
import { ReportEntity } from '../reviewer/report.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmployeeEntity,
      CompanyEntity,
      JobEntity,
      JobCategoryEntity,
      ApplicationEntity,
      AssignedJobEntity,
      SubmissionEntity,
      PaymentEntity,
      RatingReviewEntity,
      ReportEntity,
    ]),
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
