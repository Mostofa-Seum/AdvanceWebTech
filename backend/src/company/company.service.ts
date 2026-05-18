// company.service.ts

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
  AssignJobDTO,
  UpdateApplicationDTO,
  ApproveWorkDTO,
} from './company.dto';

import {
  UserEntity,
  UserRole,
  UserStatus,
} from './user.entity';

import {
  CompanyEntity,
  CompanyStatus,
} from './company.entity';

import {
  JobEntity,
  JobStatus,
} from './job.entity';

import {
  PaymentEntity,
  PaymentStatus,
} from './payment.entity';

import {
  RatingReviewEntity,
} from './rating_review.entity';

import {
  ReportEntity,
  ReportStatus,
} from './report.entity';

import {
  ApplicationEntity,
} from './application.entity';

import {
  AssignedJobEntity,
  AssignedJobStatus,
} from './assigned_job.entity';

import {
  EmployeeEntity,
} from './employee.entity';

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

    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,

    @InjectRepository(AssignedJobEntity)
    private readonly assignedJobRepository: Repository<AssignedJobEntity>,

    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,

    private readonly mailerService: MailerService,

  ) { }

  // =========================================
  // AUTH HELPER
  // =========================================

  async findOne(
    email: string,
  ): Promise<UserEntity | null> {

    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  // =========================================
  // COMPANY SIGNUP
  // =========================================

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

    const hashedPassword = await bcrypt.hash(myobj.password, 10);

    const userInstance = this.userRepository.create({
      email: myobj.email,
      password: hashedPassword,
      fullName: myobj.companyName,
      filename: file ? file.filename : null,
      role: UserRole.COMPANY,
      status: UserStatus.PENDING,
    });

    let savedUser: UserEntity;
    let savedCompany: CompanyEntity;

    await this.userRepository.manager.transaction(async (transactionalManager) => {

      savedUser = await transactionalManager.save(userInstance);

      const companyInstance = transactionalManager.create(CompanyEntity, {
        companyName: myobj.companyName,
        description: myobj.description ?? null,
        website: myobj.website ?? null,
        user: savedUser,
        status: CompanyStatus.PENDING,
      });

      savedCompany = await transactionalManager.save(companyInstance);
    });

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

  // =========================================
  // VERIFY COMPANY
  // =========================================

  async verifyCompany(
    myobj: VerifyCompanyDTO,
  ): Promise<object> {

    const company =
      await this.companyRepository.findOne({

        where: {
          companyName:
            myobj.companyName,
        },
      });

    if (!company) {

      throw new NotFoundException(
        'Company not found',
      );
    }

    company.status =
      myobj.status;

    const updated =
      await this.companyRepository.save(
        company,
      );

    return {

      message:
        'company verification updated',

      data:
        updated,
    };
  }

  // =========================================
  // PROFILE
  // =========================================

  async getProfile(
    companyName: string,
  ): Promise<object> {

    const company =
      await this.companyRepository.findOne({

        where: {
          companyName,
        },

        relations: {
          jobs: true,
        },
      });

    if (!company) {

      throw new NotFoundException(
        'Company profile not found',
      );
    }

    return company;
  }

  async editProfile(
    myobj: EditProfileDTO,
  ): Promise<object> {

    const company =
      await this.companyRepository.findOne({

        where: {
          companyName:
            myobj.companyName,
        },
      });

    if (!company) {

      throw new NotFoundException(
        'Company not found',
      );
    }

    company.companyName =
      myobj.companyName
      ?? company.companyName;

    company.website =
      myobj.website
      ?? company.website;

    company.description =
      myobj.description
      ?? company.description;

    const updated =
      await this.companyRepository.save(
        company,
      );

    return {

      message:
        'profile updated successfully',

      data:
        updated,
    };
  }

  // =========================================
  // POST JOB
  // =========================================

  async postJob(
    myobj: PostJobDTO,
  ): Promise<object> {

    const company =
      await this.companyRepository.findOne({

        where: {
          companyName:
            myobj.companyName,
        },
      });

    if (!company) {

      throw new NotFoundException(
        'Company not found',
      );
    }

    const user =
      await this.userRepository.findOne({

        where: {
          email:
            myobj.email,
        },
      });

    if (!user) {

      throw new NotFoundException(
        'User not found',
      );
    }

    const job =
      this.jobRepository.create({

        title:
          myobj.title,

        description:
          myobj.description,

        budget:
          myobj.budget,

        deadline:
          new Date(myobj.deadline),

        status:
          JobStatus.OPEN,

        company,

        companyUser:
          user,
      });

    const saved =
      await this.jobRepository.save(
        job,
      );

    return {

      message:
        'job posted successfully',

      data:
        saved,
    };
  }

  // =========================================
  // GET JOBS
  // =========================================

  async getJob(
    companyName: string,
  ): Promise<object> {

    const jobs =
      await this.jobRepository.find({

        where: {
          company: {
            companyName,
          },
        },

        relations: {
          company: true,
          applications: true,
          assignedJob: true,
        },
      });

    return {

      companyName,

      jobs,
    };
  }
  async getCompletedContracts(
    companyUserId: string
  ): Promise<object[]> {

    const contracts =
      await this.assignedJobRepository.find({

        where: {
          job: {
            companyUser: {
              userId: companyUserId
            }
          }
        },

        relations: [
          'job',
          'employee',
          'employee.user'
        ]
      });

    return contracts.map(contract => ({
      jobId: contract.job.jobId,
      jobTitle: contract.job.title,

      employeeUserId:
        contract.employee.user.userId,

      employeeId:
        contract.employee.employeeId,

      employeeName:
        contract.employee.user.fullName
    }));
  }

  // =========================================
  // EDIT JOB
  // =========================================

  async editJob(
    companyName: string,
    jobId: string,
    myobj: EditJobDTO,
  ): Promise<object> {

    const job =
      await this.jobRepository.findOne({

        where: {

          jobId,

          company: {
            companyName,
          },
        },
      });

    if (!job) {

      throw new NotFoundException(
        'Job not found',
      );
    }

    job.title =
      myobj.title
      ?? job.title;

    job.description =
      myobj.description
      ?? job.description;

    job.budget =
      myobj.budget
      ?? job.budget;

    job.deadline =
      myobj.deadline
        ? new Date(myobj.deadline)
        : job.deadline;

    const updated =
      await this.jobRepository.save(
        job,
      );

    return {

      message:
        'job updated successfully',

      data:
        updated,
    };
  }

  // =========================================
  // REMOVE JOB
  // =========================================

  async removeJob(
    companyName: string,
    jobId: string,
  ): Promise<object> {

    const job =
      await this.jobRepository.findOne({

        where: {

          jobId,

          company: {
            companyName,
          },
        },
      });

    if (!job) {

      throw new NotFoundException(
        'Job not found',
      );
    }

    job.status =
      JobStatus.REMOVED;

    await this.jobRepository.save(
      job,
    );

    return {

      message:
        'job removed successfully',

      data:
        job,
    };
  }

  // =========================================
  // GET APPLICANTS
  // =========================================

  async getApplicants(
    jobId: string,
  ): Promise<object> {

    const applicants =
      await this.applicationRepository.find({

        where: {
          job: {
            jobId,
          },
        },

        relations: {
          employee: true,
          employeeUser: true,
          job: true,
        },
      });

    return {

      message:
        'applicants retrieved',

      applicants,
    };
  }

  // =========================================
  // ACCEPT / REJECT APPLICATION
  // =========================================

  async updateApplicationStatus(
    applicationId: string,
    myobj: UpdateApplicationDTO,
  ): Promise<object> {

    const application =
      await this.applicationRepository.findOne({

        where: {
          applicationId,
        },
      });

    if (!application) {

      throw new NotFoundException(
        'Application not found',
      );
    }

    application.status =
      myobj.status;

    const updated =
      await this.applicationRepository.save(
        application,
      );

    return {

      message:
        'application status updated',

      data:
        updated,
    };
  }

  // =========================================
  // ASSIGN JOB
  // =========================================

  async assignJob(
    jobId: string,
    applicationId: string,
    myobj: AssignJobDTO,
  ): Promise<object> {

    const job =
      await this.jobRepository.findOne({

        where: {
          jobId,
        },
      });

    if (!job) {

      throw new NotFoundException(
        'Job not found',
      );
    }

    const application =
      await this.applicationRepository.findOne({

        where: {
          applicationId,
        },

        relations: {
          employee: true,
          job: true,
        },
      });

    if (!application) {

      throw new NotFoundException(
        'Application not found',
      );
    }

    if (
      application.employee.employeeId
      !== myobj.employeeId
    ) {

      throw new ForbiddenException(
        'Employee mismatch',
      );
    }

    const assigned =
      this.assignedJobRepository.create({

        job,

        application,

        employee:
          application.employee,

        status:
          AssignedJobStatus.ASSIGNED,
      });

    const saved =
      await this.assignedJobRepository.save(
        assigned,
      );

    job.status =
      JobStatus.ASSIGNED;

    await this.jobRepository.save(
      job,
    );

    return {

      message:
        'job assigned successfully',

      data:
        saved,
    };
  }

  // =========================================
  // TRACK JOB STATUS
  // =========================================

  async trackJobStatus(
    jobId: string,
  ): Promise<object> {

    const job =
      await this.jobRepository.findOne({

        where: {
          jobId,
        },

        relations: {
          assignedJob: true,
          applications: true,
          payment: true,
        },
      });

    if (!job) {

      throw new NotFoundException(
        'Job not found',
      );
    }

    return {

      message:
        'job status retrieved',

      jobId:
        job.jobId,

      status:
        job.status,

      assignedJob:
        job.assignedJob ?? null,

      applications:
        job.applications ?? [],

      payments:
        job.payment ?? null,
    };
  }

  // =========================================
  // COMPLETED WORK
  // =========================================

  async getCompletedWork(
    companyName: string,
    jobId: string,
  ): Promise<object> {

    const job =
      await this.jobRepository.findOne({

        where: {

          jobId,

          company: {
            companyName,
          },
        },

        relations: {
          assignedJob: true,
        },
      });

    if (!job) {

      throw new NotFoundException(
        'Job not found',
      );
    }

    return {

      message:
        'completed work retrieved',

      assignedJob:
        job.assignedJob,
    };
  }

  // =========================================
  // APPROVE WORK / REVISION
  // =========================================

  async approveOrRequestRevision(
    assignedJobId: string,
    myobj: ApproveWorkDTO,
  ): Promise<object> {

    const assignedJob =
      await this.assignedJobRepository.findOne({

        where: {
          assignedJobId,
        },

        relations: {
          job: true,
        },
      });

    if (!assignedJob) {

      throw new NotFoundException(
        'Assigned job not found',
      );
    }

    assignedJob.status =
      myobj.status;

    const updated =
      await this.assignedJobRepository.save(
        assignedJob,
      );

    return {

      message:
        'assigned job updated',

      feedback:
        myobj.feedback ?? null,

      data:
        updated,
    };
  }

  // =========================================
  // PAYMENT
  // =========================================

  async makePayment(
    myobj: MakePaymentDTO,
  ): Promise<object> {

    const companyUser =
      await this.userRepository.findOne({
        where: {
          userId: myobj.companyUserId,
        },
      });

    if (!companyUser) {
      throw new NotFoundException(
        'Company user not found',
      );
    }

    const employeeUser =
      await this.userRepository.findOne({
        where: {
          userId: myobj.employeeUserId,
        },
      });

    if (!employeeUser) {
      throw new NotFoundException(
        'Employee user not found',
      );
    }

    const job =
      await this.jobRepository.findOne({
        where: {
          jobId: myobj.jobId,
        },
      });

    if (!job) {
      throw new NotFoundException(
        'Job not found',
      );
    }

    const payment =
      this.paymentRepository.create({

        job,

        companyUser,

        employeeUser,

        amount:
          myobj.amount,

        paymentMethod:
          myobj.method,

        transactionId:
          myobj.transactionRef
          ?? null,

        paymentStatus:
          PaymentStatus.PENDING,

        paidAt:
          new Date(),
      });

    const saved =
      await this.paymentRepository.save(
        payment,
      );

    return {
      message:
        'payment successful',

      data:
        saved,
    };
  }

  // =========================================
  // REVIEW EMPLOYEE
  // =========================================

  async reviewEmployee(
    myobj: ReviewEmployeeDTO,
  ): Promise<object> {

    const employee =
      await this.employeeRepository.findOne({

        where: {
          employeeId:
            myobj.employeeId,
        },

        relations: {
          user: true,
        },
      });

    if (!employee) {

      throw new NotFoundException(
        'Employee not found',
      );
    }

    const company =
      await this.companyRepository.findOne({

        where: {
          user: {
            userId: myobj.companyUserId,
          },
        },

        relations: {
          user: true,
        },
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found',
      );
    }

    const job =
      await this.jobRepository.findOne({
        where: {
          jobId: myobj.jobId,
        },
      });

    if (!job) {
      throw new NotFoundException(
        'Job not found',
      );
    }

    const review =
      this.ratingReviewRepository.create({

        fromUser:
          company.user,

        toUser:
          employee.user,

        job,

        rating:
          myobj.rating,

        comment:
          myobj.comment,
      });

    const saved =
      await this.ratingReviewRepository.save(
        review,
      );

    return {

      message:
        'employee reviewed successfully',

      data:
        saved,
    };
  }

  // =========================================
  // REPORT EMPLOYEE
  // =========================================

  async reportEmployee(
    myobj: ReportEmployeeDTO,
  ): Promise<object> {

    const employee =
      await this.employeeRepository.findOne({

        where: {
          employeeId:
            myobj.employeeId,
        },

        relations: {
          user: true,
        },
      });

    if (!employee) {

      throw new NotFoundException(
        'Employee not found',
      );
    }

    const company =
      await this.companyRepository.findOne({

        where: {
          user: {
            userId: myobj.companyUserId,
          },
        },

        relations: {
          user: true,
        },
      });

    if (!company) {

      throw new NotFoundException(
        'Company not found',
      );
    }

    let job = null;

    if (myobj.jobId) {

      job =
        await this.jobRepository.findOne({

          where: {
            jobId:
              myobj.jobId,
          },
        });
    }

    const report =
      this.reportRepository.create({

        reportedBy:
          company.user,

        reportedAgainst:
          employee.user,

        job,

        reason:
          myobj.reason,

        details:
          myobj.details
          ?? null,

        status:
          ReportStatus.PENDING,
      });

    const saved =
      await this.reportRepository.save(
        report,
      );

    return {

      message:
        'employee reported successfully',

      data:
        saved,
    };
  }
}