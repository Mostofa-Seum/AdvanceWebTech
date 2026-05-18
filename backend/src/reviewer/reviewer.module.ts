import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';

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
import { MailerModule } from "@nestjs-modules/mailer"
@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity,AssignedJobEntity,
      CompanyEntity,EmployeeEntity,JobCategoryEntity,JobEntity,NotificationEntity,PaymentEntity,
      RatingReviewEntity,ReportEntity,ReviewerEntity,SubmissionEntity,UserEntity,
      WorkVerificationEntity]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          },
        }
      }),
    })
  ],
  controllers: [ReviewerController],
  providers: [ReviewerService],
  exports: [ReviewerService],
})
export class ReviewerModule {}