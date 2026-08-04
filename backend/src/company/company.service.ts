import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserStatus } from '../reviewer/user.entity';
import { CompanyEntity } from '../reviewer/company.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import {
  JobEntity,
  JobStatus,
} from '../reviewer/job.entity';
import { JobCategoryEntity } from '../reviewer/job_category.entity';
import {
  ApplicationEntity,
  ApplicationStatus,
} from '../reviewer/application.entity';
import {
  AssignedJobEntity,
  AssignedJobStatus,
} from '../reviewer/assigned_job.entity';
import { PaymentEntity, PaymentStatus } from '../reviewer/payment.entity';
import { RatingReviewEntity } from '../reviewer/rating_review.entity';
import { ReportEntity, ReportStatus } from '../reviewer/report.entity';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateJobDto,
  UpdateJobDto,
  RateDto,
  CreateReportDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(JobCategoryEntity)
    private readonly categoryRepository: Repository<JobCategoryEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(AssignedJobEntity)
    private readonly assignedJobRepository: Repository<AssignedJobEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(RatingReviewEntity)
    private readonly ratingRepository: Repository<RatingReviewEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ─── PROFILE ──────────────────────────────────────────────────────────
  async getProfile(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { companyId },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company profile not found');
    delete (company.user as any).password;
    return company;
  }

  async updateProfile(companyId: string, dto: UpdateProfileDto) {
    const company = await this.companyRepository.findOne({
      where: { companyId },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company profile not found');

    if (dto.companyName) company.companyName = dto.companyName;
    if (dto.description !== undefined) company.description = dto.description;
    if (dto.website !== undefined) company.website = dto.website;
    if (dto.phone) company.user.phone = dto.phone;
    if (dto.address) company.user.address = dto.address;
    if (dto.email) company.user.email = dto.email;

    await this.userRepository.save(company.user);
    await this.companyRepository.save(company);
    return { message: 'Profile updated successfully' };
  }

  async changePassword(companyId: string, dto: ChangePasswordDto) {
    const company = await this.companyRepository.findOne({
      where: { companyId },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, company.user.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    const salt = await bcrypt.genSalt();
    company.user.password = await bcrypt.hash(dto.newPassword, salt);
    await this.userRepository.save(company.user);
    return { message: 'Password changed successfully' };
  }

  // ─── JOBS ─────────────────────────────────────────────────────────────
  private async resolveCompanyUserId(companyId: string): Promise<string> {
    const company = await this.companyRepository.findOne({
      where: { companyId },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company.user.userId;
  }

  async createJob(companyId: string, dto: CreateJobDto) {
    const userId = await this.resolveCompanyUserId(companyId);

    let category: JobCategoryEntity | null = null;
    if (dto.categoryId) {
      category = await this.categoryRepository.findOne({
        where: { categoryId: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
    }

    const job = this.jobRepository.create({
      title: dto.title,
      description: dto.description,
      budget: dto.budget,
      deadline: new Date(dto.deadline),
      status: JobStatus.OPEN,
      companyUser: { userId } as any,
      company: { companyId } as any,
      category: category ?? undefined,
    });
    const saved = await this.jobRepository.save(job);
    return { message: 'Job posted successfully', jobId: saved.jobId };
  }

  async listMyJobs(companyId: string) {
    const jobs = await this.jobRepository.find({
      where: { company: { companyId } as any },
      relations: ['category', 'applications'],
      order: { deadline: 'DESC' },
    });
    return jobs.map((j) => ({
      ...j,
      applicationsCount: j.applications?.length ?? 0,
    }));
  }

  async getMyJob(companyId: string, jobId: string) {
    const job = await this.jobRepository.findOne({
      where: { jobId, company: { companyId } as any },
      relations: ['category', 'applications', 'assignedJob'],
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async updateJob(companyId: string, jobId: string, dto: UpdateJobDto) {
    const job = await this.getMyJob(companyId, jobId);
    if (dto.title) job.title = dto.title;
    if (dto.description) job.description = dto.description;
    if (dto.budget) job.budget = dto.budget;
    if (dto.deadline) job.deadline = new Date(dto.deadline);
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      job.category = category;
    }
    await this.jobRepository.save(job);
    return { message: 'Job updated successfully' };
  }

  async deleteJob(companyId: string, jobId: string) {
    const job = await this.getMyJob(companyId, jobId);
    if (job.status === JobStatus.ASSIGNED || job.status === JobStatus.IN_PROGRESS) {
      throw new ConflictException(
        'Cannot remove a job that is already assigned or in progress',
      );
    }
    job.status = JobStatus.REMOVED;
    await this.jobRepository.save(job);
    return { message: 'Job removed' };
  }

  // ─── APPLICATIONS ────────────────────────────────────────────────────
  async listJobApplications(companyId: string, jobId: string) {
    // Ensure the job belongs to this company
    await this.getMyJob(companyId, jobId);
    return this.applicationRepository.find({
      where: { job: { jobId } as any },
      relations: ['employee', 'employee.user'],
      order: { appliedAt: 'DESC' },
    });
  }

  /** Accept application → create assignment, hold payment, reject others. */
  async acceptApplication(companyId: string, applicationId: string) {
    const application = await this.applicationRepository.findOne({
      where: { applicationId },
      relations: ['job', 'job.company', 'employee', 'employee.user', 'employeeUser'],
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.job.company?.companyId !== companyId) {
      throw new ForbiddenException('This application does not belong to your company');
    }
    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictException('Application is no longer pending');
    }

    const job = application.job;
    if (job.status !== JobStatus.OPEN) {
      throw new ConflictException('Job is no longer open for assignment');
    }

    // 1) Mark this application accepted
    application.status = ApplicationStatus.ACCEPTED;
    await this.applicationRepository.save(application);

    // 2) Reject all other pending applications for this job
    await this.applicationRepository.update(
      { job: { jobId: job.jobId } as any, status: ApplicationStatus.PENDING },
      { status: ApplicationStatus.REJECTED },
    );

    // 3) Create the assignment
    const assignment = this.assignedJobRepository.create({
      job,
      application,
      employee: application.employee,
      status: AssignedJobStatus.ASSIGNED,
    });
    await this.assignedJobRepository.save(assignment);

    // 4) Move the job to ASSIGNED
    job.status = JobStatus.ASSIGNED;
    await this.jobRepository.save(job);

    // 5) Create the escrow payment (HELD) — released later by reviewer
    const existingPayment = await this.paymentRepository.findOne({
      where: { job: { jobId: job.jobId } as any },
    });
    if (!existingPayment) {
      const payment = this.paymentRepository.create({
        job,
        companyUser: { userId: job.companyUser?.userId ?? null } as any,
        employeeUser: { userId: application.employeeUser?.userId ?? null } as any,
        amount: Number(job.budget),
        paymentStatus: PaymentStatus.HELD,
        paymentMethod: 'escrow',
      });
      await this.paymentRepository.save(payment);
    }

    // 6) Notify the employee
    if (application.employeeUser?.userId) {
      await this.notificationsService.notifyEmployee(
        application.employeeUser.userId,
        '✅ Application Accepted',
        `Your application for "${job.title}" was accepted. You can now start working.`,
      );
    }

    return { message: 'Application accepted — escrow payment held', assignment };
  }

  async rejectApplication(companyId: string, applicationId: string) {
    const application = await this.applicationRepository.findOne({
      where: { applicationId },
      relations: ['job', 'job.company', 'employeeUser'],
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.job.company?.companyId !== companyId) {
      throw new ForbiddenException('This application does not belong to your company');
    }
    application.status = ApplicationStatus.REJECTED;
    await this.applicationRepository.save(application);

    if (application.employeeUser?.userId) {
      await this.notificationsService.notifyEmployee(
        application.employeeUser.userId,
        '❌ Application Rejected',
        `Your application for "${application.job.title}" was not accepted.`,
      );
    }
    return { message: 'Application rejected' };
  }

  /** Company releases the held escrow → moves to PENDING for reviewer final release. */
  async releasePayment(companyId: string, paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId },
      relations: ['job', 'job.company'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.job?.company?.companyId !== companyId) {
      throw new ForbiddenException('This payment does not belong to your company');
    }
    if (payment.paymentStatus === PaymentStatus.PENDING) {
      return { message: 'Payment already released for final settlement' };
    }
    if (payment.paymentStatus === PaymentStatus.RELEASED) {
      return { message: 'Payment already fully released' };
    }
    payment.paymentStatus = PaymentStatus.PENDING;
    await this.paymentRepository.save(payment);
    return { message: 'Escrow released — pending reviewer settlement' };
  }

  /** List escrow payments associated with this company. */
  async listMyPayments(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { companyId },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return this.paymentRepository.find({
      where: { companyUser: { userId: company.user.userId } as any },
      relations: ['job', 'employeeUser'],
      order: { paidAt: 'DESC' },
    });
  }

  // ─── RATING ──────────────────────────────────────────────────────────
  async rateEmployee(companyId: string, jobId: string, dto: RateDto) {
    const job = await this.getMyJob(companyId, jobId);
    // Find the assigned employee
    const assignment = job.assignedJob;
    if (!assignment) {
      throw new ConflictException('This job has no assigned employee to rate');
    }
    const fullAssignment = await this.assignedJobRepository.findOne({
      where: { assignedJobId: assignment.assignedJobId },
      relations: ['employee', 'employee.user'],
    });
    if (!fullAssignment?.employee?.user) {
      throw new NotFoundException('Assigned employee not found');
    }

    // Prevent duplicate ratings on the same job by the same company user
    const companyUserId = await this.resolveCompanyUserId(companyId);
    const existing = await this.ratingRepository.findOne({
      where: {
        job: { jobId } as any,
        fromUser: { userId: companyUserId } as any,
      },
    });
    if (existing) throw new ConflictException('You have already rated this job');

    const review = this.ratingRepository.create({
      job,
      fromUser: { userId: companyUserId } as any,
      toUser: { userId: fullAssignment.employee.user.userId } as any,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });
    await this.ratingRepository.save(review);

    // Bump the employee's trust score (simple running average)
    const employee = fullAssignment.employee;
    const allRatings = await this.ratingRepository.find({
      where: { toUser: { userId: fullAssignment.employee.user.userId } as any },
    });
    const avg =
      allRatings.reduce((sum, r) => sum + Number(r.rating), 0) /
      (allRatings.length || 1);
    employee.trustScore = Math.round(avg * 10) / 10;
    await this.employeeRepository.save(employee);

    return { message: 'Rating submitted successfully' };
  }

  // ─── REPORTS ─────────────────────────────────────────────────────────
  async createReport(companyId: string, dto: CreateReportDto) {
    const userId = await this.resolveCompanyUserId(companyId);
    const report = this.reportRepository.create({
      reportedBy: { userId } as any,
      reportedAgainst: { userId: dto.againstUserId } as any,
      job: dto.jobId ? ({ jobId: dto.jobId } as any) : null,
      reason: dto.reason,
      details: dto.details ?? null,
      status: ReportStatus.PENDING,
    });
    await this.reportRepository.save(report);
    return { message: 'Report submitted successfully' };
  }

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────
  async listNotifications(companyId: string) {
    const userId = await this.resolveCompanyUserId(companyId);
    return this.notificationsService.listForUser(userId);
  }

  async markNotificationRead(companyId: string, notificationId: string) {
    const userId = await this.resolveCompanyUserId(companyId);
    return (
      this.notificationsService.markAsRead(notificationId, userId) ?? {
        message: 'Notification not found',
      }
    );
  }

  async markAllNotificationsRead(companyId: string) {
    const userId = await this.resolveCompanyUserId(companyId);
    return this.notificationsService.markAllRead(userId);
  }
}
