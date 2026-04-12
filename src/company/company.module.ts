import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { AuthModule } from '../auth/auth.module';
import { jwtConstants } from '../auth/constants';

import { UserEntity } from './user.entity';
import { EmployeeEntity } from './employee.entity';
import { CompanyEntity } from './company.entity';
import { ReviewerEntity } from './reviewer.entity';
import { JobCategoryEntity } from './job-category.entity';
import { JobEntity } from './job.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned-job.entity';
import { SubmissionEntity } from './submission.entity';
import { WorkVerificationEntity } from './work-verification.entity';
import { RatingReviewEntity } from './rating-review.entity';
import { PaymentEntity } from './payment.entity';
import { ReportEntity } from './report.entity';
import { NotificationEntity } from './notification.entity';
import { AccountVerificationEntity } from './account-verification.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
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
      AccountVerificationEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
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
export class CompanyModule {}