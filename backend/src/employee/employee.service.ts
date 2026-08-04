import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../reviewer/user.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import { CompanyEntity } from '../reviewer/company.entity';
import { JobEntity, JobStatus } from '../reviewer/job.entity';
import { JobCategoryEntity } from '../reviewer/job_category.entity';
import {
  ApplicationEntity,
  ApplicationStatus,
} from '../reviewer/application.entity';
import {
  AssignedJobEntity,
  AssignedJobStatus,
} from '../reviewer/assigned_job.entity';
import { SubmissionEntity, SubmissionStatus } from '../reviewer/submission.entity';
import { PaymentEntity, PaymentStatus } from '../reviewer/payment.entity';
import { RatingReviewEntity } from '../reviewer/rating_review.entity';
import { ReportEntity, ReportStatus } from '../reviewer/report.entity';
import { NotificationsService } from '../notifications/notifications.service';
import {
  UpdateProfileDto,
  ApplyDto,
  SubmitWorkDto,
  RateDto,
  CreateReportDto,
  ChangePasswordDto,
} from './employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(JobCategoryEntity)
    private readonly categoryRepository: Repository<JobCategoryEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(AssignedJobEntity)
    private readonly assignedJobRepository: Repository<AssignedJobEntity>,
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(RatingReviewEntity)
    private readonly ratingRepository: Repository<RatingReviewEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ─── PROFILE ──────────────────────────────────────────────────────────
  async getProfile(employeeId: string) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
    if (!employee) throw new NotFoundException('Employee profile not found');
    delete (employee.user as any).password;
    return employee;
  }

  async updateProfile(employeeId: string, dto: UpdateProfileDto) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
    if (!employee) throw new NotFoundException('Employee profile not found');

    if (dto.skills !== undefined) employee.skills = dto.skills;
    if (dto.experience !== undefined) employee.experience = dto.experience;
    if (dto.portfolio !== undefined) employee.portfolio = dto.portfolio;
    if (dto.phone) employee.user.phone = dto.phone;
    if (dto.address) employee.user.address = dto.address;
    if (dto.email) employee.user.email = dto.email;
    if (dto.fullName) employee.user.fullName = dto.fullName;

    await this.userRepository.save(employee.user);
    await this.employeeRepository.save(employee);
    return { message: 'Profile updated successfully' };
  }

  async changePassword(employeeId: string, dto: ChangePasswordDto) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, employee.user.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    const salt = await bcrypt.genSalt();
    employee.user.password = await bcrypt.hash(dto.newPassword, salt);
    await this.userRepository.save(employee.user);
    return { message: 'Password changed successfully' };
  }

  private async resolveUserId(employeeId: string): Promise<string> {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee.user.userId;
  }

  // ─── BROWSE / APPLY ──────────────────────────────────────────────────
  async browseJobs(employeeId: string, category?: string, search?: string) {
    const userId = await this.resolveUserId(employeeId);

    // Find jobs this employee already applied to (to allow the UI to flag them)
    const myApplications = await this.applicationRepository.find({
      where: { employeeUser: { userId } as any },
      relations: ['job'],
    });
    const appliedJobIds = new Set(myApplications.map((a) => a.job?.jobId).filter(Boolean));

    const where: any = { status: JobStatus.OPEN };
    const findOptions: any = {
      where,
      relations: ['category', 'company', 'company.user'],
      order: { deadline: 'DESC' },
    };

    if (search) {
      findOptions.where = [
        { status: JobStatus.OPEN, title: ILike(`%${search}%`) },
        { status: JobStatus.OPEN, description: ILike(`%${search}%`) },
      ];
    }
    if (category && category !== 'All') {
      const applyCategory = (w: any) => ({ ...w, category: { categoryName: category } });
      findOptions.where = Array.isArray(findOptions.where)
        ? findOptions.where.map(applyCategory)
        : applyCategory(findOptions.where);
    }

    const jobs = await this.jobRepository.find(findOptions);
    return jobs.map((j) => {
      if (j?.company?.user) delete (j.company.user as any).password;
      return {
        ...j,
        alreadyApplied: appliedJobIds.has(j.jobId),
      };
    });
  }

  async getJob(employeeId: string, jobId: string) {
    const job = await this.jobRepository.findOne({
      where: { jobId },
      relations: ['category', 'company', 'company.user'],
    });
    if (!job) throw new NotFoundException('Job not found');

    const userId = await this.resolveUserId(employeeId);
    const myApp = await this.applicationRepository.findOne({
      where: { job: { jobId } as any, employeeUser: { userId } as any },
    });
    if (job?.company?.user) delete (job.company.user as any).password;
    return { ...job, myApplication: myApp ?? null };
  }

  async apply(employeeId: string, jobId: string, dto: ApplyDto) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
    if (!employee) throw new NotFoundException('Employee profile not found');

    const job = await this.jobRepository.findOne({
      where: { jobId },
      relations: ['company', 'company.user'],
    });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== JobStatus.OPEN) {
      throw new ConflictException('This job is no longer open for applications');
    }

    // Prevent duplicate applications
    const existing = await this.applicationRepository.findOne({
      where: {
        job: { jobId } as any,
        employeeUser: { userId: employee.user.userId } as any,
      },
    });
    if (existing) throw new ConflictException('You have already applied to this job');

    const application = this.applicationRepository.create({
      job,
      employeeUser: { userId: employee.user.userId } as any,
      employee,
      coverLetter: dto.coverLetter ?? null,
      status: ApplicationStatus.PENDING,
    });
    await this.applicationRepository.save(application);

    // Notify the company
    if (job.company?.user?.userId) {
      await this.notificationsService.notifyCompany(
        job.company.user.userId,
        '🔔 New Application',
        `Someone applied to your job "${job.title}".`,
      );
    }

    return { message: 'Application submitted successfully', applicationId: application.applicationId };
  }

  // ─── MY APPLICATIONS ─────────────────────────────────────────────────
  async listMyApplications(employeeId: string) {
    const userId = await this.resolveUserId(employeeId);
    return this.applicationRepository.find({
      where: { employeeUser: { userId } as any },
      relations: ['job', 'job.company', 'job.category'],
      order: { appliedAt: 'DESC' },
    });
  }

  async withdrawApplication(employeeId: string, applicationId: string) {
    const userId = await this.resolveUserId(employeeId);
    const application = await this.applicationRepository.findOne({
      where: { applicationId, employeeUser: { userId } as any },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictException('Only pending applications can be withdrawn');
    }
    await this.applicationRepository.remove(application);
    return { message: 'Application withdrawn' };
  }

  // ─── ASSIGNED JOBS / SUBMIT WORK ─────────────────────────────────────
  async listAssigned(employeeId: string) {
    return this.assignedJobRepository.find({
      where: { employee: { employeeId } as any },
      relations: ['job', 'job.category', 'job.company'],
      order: { assignedAt: 'DESC' },
    });
  }

  async getAssigned(employeeId: string, assignedJobId: string) {
    const assignment = await this.assignedJobRepository.findOne({
      where: { assignedJobId, employee: { employeeId } as any },
      relations: ['job', 'job.category', 'job.company', 'submissions'],
    });
    if (!assignment) throw new NotFoundException('Assigned job not found');
    return assignment;
  }

  async submitWork(employeeId: string, assignedJobId: string, dto: SubmitWorkDto) {
    const assignment = await this.assignedJobRepository.findOne({
      where: { assignedJobId, employee: { employeeId } as any },
      relations: ['job', 'employee'],
    });
    if (!assignment) throw new NotFoundException('Assigned job not found');

    if (
      assignment.status === AssignedJobStatus.COMPLETED
    ) {
      throw new ConflictException('This assignment is already completed');
    }

    const submission = this.submissionRepository.create({
      assignedJob: assignment,
      employee: assignment.employee,
      submissionText: dto.submissionText ?? null,
      fileUrl: dto.fileUrl ?? null,
      liveLink: dto.liveLink ?? null,
      status: SubmissionStatus.SUBMITTED,
    });
    await this.submissionRepository.save(submission);

    assignment.status = AssignedJobStatus.SUBMITTED;
    await this.assignedJobRepository.save(assignment);

    if (assignment.job) {
      assignment.job.status = JobStatus.SUBMITTED;
      await this.jobRepository.save(assignment.job);
    }

    // Notify reviewers that there's new work to verify
    await this.notificationsService.notifyReviewers(
      '🔔 New Work Submission',
      `A new submission for "${assignment.job?.title ?? 'a job'}" needs review.`,
    );

    return { message: 'Work submitted successfully', submissionId: submission.submissionId };
  }

  async listMySubmissions(employeeId: string) {
    return this.submissionRepository.find({
      where: { employee: { employeeId } as any },
      relations: ['assignedJob', 'assignedJob.job'],
      order: { submittedAt: 'DESC' },
    });
  }

  // ─── EARNINGS ────────────────────────────────────────────────────────
  async listEarnings(employeeId: string) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const userId = employee.user
      ? employee.user.userId
      : (await this.resolveUserId(employeeId));

    const payments = await this.paymentRepository.find({
      where: { employeeUser: { userId } as any },
      relations: ['job', 'companyUser'],
      order: { paidAt: 'DESC' },
    });

    return {
      balance: Number(employee.balance ?? 0),
      payments,
    };
  }

  // ─── RATING ──────────────────────────────────────────────────────────
  async rateCompany(employeeId: string, jobId: string, dto: RateDto) {
    const userId = await this.resolveUserId(employeeId);

    const job = await this.jobRepository.findOne({
      where: { jobId },
      relations: ['companyUser', 'assignedJob'],
    });
    if (!job) throw new NotFoundException('Job not found');
    if (!job.companyUser?.userId) {
      throw new ConflictException('This job has no company to rate');
    }

    const existing = await this.ratingRepository.findOne({
      where: {
        job: { jobId } as any,
        fromUser: { userId } as any,
      },
    });
    if (existing) throw new ConflictException('You have already rated this job');

    const review = this.ratingRepository.create({
      job,
      fromUser: { userId } as any,
      toUser: { userId: job.companyUser.userId } as any,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });
    await this.ratingRepository.save(review);

    // Bump company trust score
    const company = await this.companyRepository.findOne({
      where: { user: { userId: job.companyUser.userId } as any },
    });
    if (company) {
      const allRatings = await this.ratingRepository.find({
        where: { toUser: { userId: job.companyUser.userId } as any },
      });
      const avg =
        allRatings.reduce((sum, r) => sum + Number(r.rating), 0) /
        (allRatings.length || 1);
      company.trustScore = Math.round(avg * 10) / 10;
      await this.companyRepository.save(company);
    }

    return { message: 'Rating submitted successfully' };
  }

  // ─── REPORTS ─────────────────────────────────────────────────────────
  async createReport(employeeId: string, dto: CreateReportDto) {
    const userId = await this.resolveUserId(employeeId);
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
  async listNotifications(employeeId: string) {
    const userId = await this.resolveUserId(employeeId);
    return this.notificationsService.listForUser(userId);
  }

  async markNotificationRead(employeeId: string, notificationId: string) {
    const userId = await this.resolveUserId(employeeId);
    return (
      this.notificationsService.markAsRead(notificationId, userId) ?? {
        message: 'Notification not found',
      }
    );
  }

  async markAllNotificationsRead(employeeId: string) {
    const userId = await this.resolveUserId(employeeId);
    return this.notificationsService.markAllRead(userId);
  }
}
