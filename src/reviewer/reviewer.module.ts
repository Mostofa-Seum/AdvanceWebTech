import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';

// Import all 15 entities from the current directory
import { AccountVerificationEntity } from './account_verification.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned_job.entity';
import { CompanyEntity } from './company.entity';
import { EmployeeEntity } from './employee.entity';
import { JobCategoryEntity } from './job_category.entity';
import { JobEntity } from './job.entity';
import { NotificationEntity } from './notification.entity';
import { PaymentEntity } from './payment.entity';
import { RatingReviewEntity } from './rating_review.entity';
import { ReportEntity } from './report.entity';
import { ReviewerEntity } from './reviewer.entity';
import { SubmissionEntity } from './submission.entity';
import { UserEntity } from './user.entity';
import { WorkVerificationEntity } from './work_verification.entity';

@Module({
  imports: [
    // Register all the entities with TypeORM in this module
    TypeOrmModule.forFeature([
      AccountVerificationEntity,
      ApplicationEntity,
      AssignedJobEntity,
      CompanyEntity,
      EmployeeEntity,
      JobCategoryEntity,
      JobEntity,
      NotificationEntity,
      PaymentEntity,
      RatingReviewEntity,
      ReportEntity,
      ReviewerEntity,
      SubmissionEntity,
      UserEntity,
      WorkVerificationEntity,
    ]),
  ],
  controllers: [ReviewerController],
  providers: [ReviewerService],
})
export class ReviewerModule {}