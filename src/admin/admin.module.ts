import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity, UserCategory3Entity } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { EmployeeEntity } from './employee.entity';
import { CompanyEntity } from './company.entity';
import { ReviewerEntity } from './reviewer.entity';
import { JobCategoryEntity } from './job-category.entity';
import { JobEntity } from './job.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned_job.entity';
import { SubmissionEntity } from './submission.entity';
import { WorkVerificationEntity } from './work-verification.entity';
import { RatingReviewEntity } from './rating-review.entity';
import { PaymentEntity } from './payment.entity';
import { ReportEntity } from './report.entity';
import { NotificationEntity } from './notification.entity';
import { AccountVerificationEntity } from './account-verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      UserCategory3Entity,
      UserEntity,
      EmployeeEntity,
      CompanyEntity,
      ReviewerEntity,
      JobCategoryEntity,
      JobEntity,
      ApplicationEntity,
      AssignedJobEntity,
      SubmissionEntity,
      WorkVerificationEntity,
      RatingReviewEntity,
      PaymentEntity,
      ReportEntity,
      NotificationEntity,
      AccountVerificationEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}