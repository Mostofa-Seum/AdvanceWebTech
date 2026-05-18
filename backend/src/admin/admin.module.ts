import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { UserEntity } from '../reviewer/user.entity';
import { JobEntity } from '../reviewer/job.entity';
import { CompanyEntity } from '../reviewer/company.entity';
import { ReviewerEntity } from '../reviewer/reviewer.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import { ReportEntity } from '../reviewer/report.entity';
import { PaymentEntity } from '../reviewer/payment.entity';
import { SubmissionEntity } from '../reviewer/submission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      JobEntity,
      CompanyEntity,
      ReviewerEntity,
      EmployeeEntity,
      ReportEntity,
      PaymentEntity,
      SubmissionEntity,
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
