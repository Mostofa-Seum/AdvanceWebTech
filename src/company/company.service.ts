import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

import {
  CompanySignupDTO,
  EditJobDTO,
  EditProfileDTO,
  MakePaymentDTO,
  PostJobDTO,
  ReportEmployeeDTO,
  ReviewEmployeeDTO,
  VerifyCompanyDTO,
} from './company.dto';

import { UserEntity, UserRole, UserStatus } from './user.entity';
import { CompanyEntity } from './company.entity';
import { JobEntity } from './job.entity';
import { PaymentEntity, PaymentStatus } from './payment.entity';
import { RatingReviewEntity } from './rating-review.entity';
import { ReportEntity, ReportStatus } from './report.entity';
import {
  AccountVerificationEntity,
  AccountVerificationStatus,
} from './account-verification.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned-job.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,

    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,

    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    @InjectRepository(RatingReviewEntity)
    private readonly ratingReviewRepository: Repository<RatingReviewEntity>,

    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,

    @InjectRepository(AccountVerificationEntity)
    private readonly verificationRepository: Repository<AccountVerificationEntity>,

    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,

    @InjectRepository(AssignedJobEntity)
    private readonly assignedJobRepository: Repository<AssignedJobEntity>,

    private readonly mailerService: MailerService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findOne(email: string): Promise<UserEntity | null> {
  return this.userRepository.findOne({
    where: { email, role: UserRole.COMPANY },
    relations: {
      company: true,
    },
  });
}

  async signupCompany(
    myobj: CompanySignupDTO,
    file?: Express.Multer.File,
  ): Promise<object> {
    const existingUser = await this.userRepository.findOne({
      where: { email: myobj.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(myobj.password, salt);

    const user = this.userRepository.create({
      email: myobj.email,
      password: hashedPassword,
      fullName: myobj.companyName,
      filename: file ? file.filename : null,
      role: UserRole.COMPANY,
      status: UserStatus.ACTIVE,
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    const savedUser = await this.userRepository.save(user);

    
const company = this.companyRepository.create({
  companyName: myobj.companyName,
  email: myobj.email,
  password: hashedPassword,
  user: savedUser,
});

    const savedCompany = await this.companyRepository.save(company);

    try {
      await this.mailerService.sendMail({
        to: myobj.email,
        subject: 'Company Signup Successful',
        text: `Hello ${myobj.companyName}, your company account has been created successfully.`,
      });
    } catch (error) {
      console.log('Mail send failed', error);
    }

    return {
      message: 'company signup successful',
      user: savedUser,
      company: savedCompany,
    };
  }

  async verifyCompany(myobj: VerifyCompanyDTO): Promise<object> {
    const company = await this.companyRepository.findOne({
      where: {
        companyName: myobj.companyName,
        user: { email: myobj.email },
      },
      relations: { user: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const verification = this.verificationRepository.create({
      user: company.user,
      documentUrl: myobj.documentUrl ?? null,
      status: AccountVerificationStatus.PENDING,
    });

    const saved = await this.verificationRepository.save(verification);

    return {
      message: 'company verification request submitted',
      data: saved,
    };
  }

  async getVerificationStatus(
    companyName: string,
    email: string,
  ): Promise<object> {
    const company = await this.companyRepository.findOne({
      where: {
        companyName,
        user: { email },
      },
      relations: { user: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const verification = await this.verificationRepository.findOne({
      where: { user: { userId: company.user.userId } },
      order: { submittedAt: 'DESC' },
      relations: { user: true },
    });

    if (!verification) {
      throw new NotFoundException('Verification request not found');
    }

    return verification;
  }

  async getProfile(companyName: string, email: string): Promise<object> {
    const company = await this.companyRepository.findOne({
      where: {
        companyName,
        user: { email },
      },
      relations: { user: true },
    });

    if (!company) {
      throw new NotFoundException('Company profile not found');
    }

    return company;
  }

  async editProfile(myobj: EditProfileDTO): Promise<object> {
    if (!myobj.companyName) {
      throw new BadRequestException('companyName is required to update profile');
    }

    const company = await this.companyRepository.findOne({
      where: { companyName: myobj.companyName },
      relations: { user: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    company.companyName = myobj.companyName ?? company.companyName;
    company.website = myobj.website ?? company.website;
    company.description = myobj.description ?? company.description;

    const updated = await this.companyRepository.save(company);

    return {
      message: 'profile is updated',
      data: updated,
    };
  }

  async postJob(myobj: PostJobDTO): Promise<object> {
    const company = await this.companyRepository.findOne({
      where: {
        companyName: myobj.companyName,
        user: { email: myobj.email },
      },
      relations: { user: true },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const job = this.jobRepository.create({
      title: myobj.title,
      description: myobj.description,
      budget: myobj.budget,
      deadline: new Date(myobj.deadline),
      company,
      companyUser: company.user,
    });

    const saved = await this.jobRepository.save(job);

    return {
      message: 'job posted',
      data: saved,
    };
  }

  async getJob(companyName: string, email: string): Promise<object> {
    const jobs = await this.jobRepository.find({
      where: {
        company: {
          companyName,
          user: { email },
        },
      },
      relations: { company: true, companyUser: true },
    });

    return {
      companyName,
      email,
      jobs,
    };
  }

  async editJob(
    companyName: string,
    email: string,
    jobId: string,
    myobj: EditJobDTO,
  ): Promise<object> {
    const job = await this.jobRepository.findOne({
      where: {
        jobId,
        company: {
          companyName,
          user: { email },
        },
      },
      relations: { company: { user: true } as any },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.title = myobj.title ?? job.title;
    job.description = myobj.description ?? job.description;
    job.budget = myobj.budget ?? job.budget;
    job.deadline = myobj.deadline ? new Date(myobj.deadline) : job.deadline;

    const updated = await this.jobRepository.save(job);

    return {
      message: 'job edited',
      data: updated,
    };
  }

  async removeJob(companyName: string, jobId: string): Promise<object> {
    const job = await this.jobRepository.findOne({
      where: {
        jobId,
        company: { companyName },
      },
      relations: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.jobRepository.delete(jobId);

    return {
      message: 'job removed',
      jobId,
      companyName,
    };
  }

  async getApplicants(
    companyName: string,
    email: string,
    jobId: string,
  ): Promise<object> {
    const job = await this.jobRepository.findOne({
      where: {
        jobId,
        company: {
          companyName,
          user: { email },
        },
      },
      relations: { company: { user: true } as any },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const applicants = await this.applicationRepository.find({
      where: { job: { jobId } },
      relations: { employee: true, employeeUser: true, job: true },
    });

    return {
      message: 'job applicants data',
      applicants,
    };
  }

  async assignJob(
    jobId: string,
    applicationId: string,
    myobj: { employeeId: string },
  ): Promise<object> {
    const job = await this.jobRepository.findOne({ where: { jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const application = await this.applicationRepository.findOne({
      where: { applicationId },
      relations: { employee: true, job: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.employee.employeeId !== myobj.employeeId) {
      throw new ForbiddenException('Employee does not match application');
    }

    const assigned = this.assignedJobRepository.create({
      job,
      application,
      employee: application.employee,
    });

    const saved = await this.assignedJobRepository.save(assigned);

    return {
      message: 'job assigned successfully',
      data: saved,
    };
  }

  async getCompletedWork(
    companyName: string,
    email: string,
    jobId: string,
  ): Promise<object> {
    const job = await this.jobRepository.findOne({
      where: {
        jobId,
        company: {
          companyName,
          user: { email },
        },
      },
      relations: {
        assignedJob: { submissions: true } as any,
        company: { user: true } as any,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      message: 'completed work data',
      assignedJob: job.assignedJob,
    };
  }

  async reviewEmployee(myobj: ReviewEmployeeDTO): Promise<object> {
    const review = this.ratingReviewRepository.create({
      rating: myobj.rating,
      comment: myobj.comment,
      job: { jobId: myobj.jobId } as any,
      toUser: { userId: myobj.employeeId } as any,
      fromUser: null as any,
    });

    const saved = await this.ratingReviewRepository.save(review);

    return {
      message: 'employee reviewed successfully',
      data: saved,
    };
  }

  async reportEmployee(myobj: ReportEmployeeDTO): Promise<object> {
    const report = this.reportRepository.create({
      reason: myobj.reason,
      details: myobj.details ?? null,
      status: ReportStatus.PENDING,
      job: myobj.jobId ? ({ jobId: myobj.jobId } as any) : null,
      reportedAgainst: { userId: myobj.employeeId } as any,
      reportedBy: null as any,
    });

    const saved = await this.reportRepository.save(report);

    return {
      message: 'employee reported successfully',
      data: saved,
    };
  }

  async makePayment(myobj: MakePaymentDTO): Promise<object> {
    const payment = this.paymentRepository.create({
      job: { jobId: myobj.jobId } as any,
      amount: myobj.amount,
      paymentMethod: myobj.method,
      transactionId: myobj.transactionRef ?? null,
      paymentStatus: PaymentStatus.PENDING,
    });

    const saved = await this.paymentRepository.save(payment);

    return {
      message: 'payment successful',
      data: saved,
    };
  }
}