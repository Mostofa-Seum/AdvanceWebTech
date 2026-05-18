import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { AuthModule } from '../auth/auth.module';
import { jwtConstants } from '../auth/constants';

// Entities
import { UserEntity } from './user.entity';
import { EmployeeEntity } from './employee.entity';
import { CompanyEntity } from './company.entity';
import { ReviewerEntity } from './reviewer.entity';
import { JobCategoryEntity } from './job_category.entity';
import { JobEntity } from './job.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned_job.entity';
import { SubmissionEntity } from './submission.entity';
import { WorkVerificationEntity } from './work_verification.entity';
import { RatingReviewEntity } from './rating_review.entity';
import { PaymentEntity } from './payment.entity';
import { ReportEntity } from './report.entity';
import { NotificationEntity } from './notification.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule), // ✅ FIXED circular dependency

    TypeOrmModule.forFeature([
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
    ]),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'yourgmail@gmail.com',
          pass: 'your_app_password',
        },
      },
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule { }