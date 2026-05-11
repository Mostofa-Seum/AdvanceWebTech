import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserRole, UserStatus } from './user.entity';
import { ReviewerEntity } from './reviewer.entity';
import { CompanyEntity, CompanyStatus } from './company.entity';
import { CreateUserDto } from './user.dto';
import { LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';
import { SubmissionEntity, SubmissionStatus } from './submission.entity';
import { WorkVerificationEntity, VerificationDecision } from './work_verification.entity';
import { JobEntity, JobStatus } from './job.entity';
import { AssignedJobEntity, AssignedJobStatus } from './assigned_job.entity';
import { PaymentEntity, PaymentStatus } from './payment.entity';
import { EmployeeEntity } from './employee.entity';
import { ReportEntity, ReportStatus } from './report.entity';

@Injectable()
export class ReviewerService {
  async findOne(username: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { email: username, role: UserRole.REVIEWER },
      relations: ['reviewer']
    });
    return user || undefined;
  }

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewerEntity)
    private readonly reviewerRepository: Repository<ReviewerEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
    @InjectRepository(WorkVerificationEntity)
    private readonly workVerificationRepository: Repository<WorkVerificationEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(AssignedJobEntity)
    private readonly assignedJobRepository: Repository<AssignedJobEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly mailerService: MailerService,
  ) { }

  //Signup
  async signup(userDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: userDto.email },
        { phone: userDto.phone }
      ]
    });

    if (existingUser) {
      throw new ConflictException('A user with this email or phone number already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const newUser = this.userRepository.create({
      email: userDto.email,
      password: hashedPassword,
      fullName: userDto.fullName,
      phone: userDto.phone,
      address: userDto.address,
      filename: userDto.filename,
      role: UserRole.REVIEWER,
      status: UserStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(newUser);

    const newReviewer = this.reviewerRepository.create({
      user: savedUser,
      trustScore: 0,
      serviceFee: 0,
    });

    await this.reviewerRepository.save(newReviewer);

    // Send a welcome email
    await this.mailerService.sendMail({
      to: savedUser.email,
      from: '"Support Team" <support@abc.com>',
      subject: 'Welcome to our Platform!',
      text: 'Thanks for signing up! Your account is pending verification.',
      html: '<b>Thanks for signing up!</b> <p>Your account is pending verification.</p>',
    });

    // Removed password for security
    const { password, ...result } = savedUser;

    return {
      message: 'Reviewer account created successfully',
      user: result,
    };
  }

  //Login
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, role: UserRole.REVIEWER },
      relations: ['reviewer']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Strip password from output
    const { password, ...result } = user;

    return {
      message: 'Login successful',
      user: result,
      reviewerId: user.reviewer.reviewerId, // Handing back the specific reviewer ID
    };
  }


  //Get Profile
  async getProfile(reviewerId: string) {
    const reviewer = await this.reviewerRepository.findOne({
      where: { reviewerId: reviewerId },
      relations: ['user'] // Pulls the connected UserEntity data
    });

    if (!reviewer) {
      throw new NotFoundException();
    }

    // Strip password before returning
    delete reviewer.user.password;
    return reviewer;
  }

  //Update Profile
  async updateProfile(reviewerId: string, updateProfileDto: UpdateProfileDto) {
    const reviewer = await this.reviewerRepository.findOne({
      where: { reviewerId: reviewerId },
      relations: ['user']
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer profile not found');
    }

    // Update the User properties
    if (updateProfileDto.name) reviewer.user.fullName = updateProfileDto.name;
    if (updateProfileDto.phone) reviewer.user.phone = updateProfileDto.phone;
    if (updateProfileDto.address) reviewer.user.address = updateProfileDto.address;
    if (updateProfileDto.email) reviewer.user.email = updateProfileDto.email;


    // Update the Reviewer properties
    if (updateProfileDto.expertise) reviewer.expertise = updateProfileDto.expertise;
    if (updateProfileDto.serviceFee) reviewer.serviceFee = updateProfileDto.serviceFee;
    if (updateProfileDto.trustScore) reviewer.trustScore = updateProfileDto.trustScore;

    // Save changes
    await this.userRepository.save(reviewer.user);
    await this.reviewerRepository.save(reviewer);

    return { message: 'Profile updated successfully' };
  }


  //Verify User
  verifyUser(id: number) {
    return {
      message: 'User identity verified successfully',
      userId: id,
    };
  }

  //Get Pending Companies
  async getPendingCompanies() {
    return this.companyRepository.find({
      where: { status: CompanyStatus.PENDING },
    });
  }

  // Update Company Status
  async updateCompanyStatus(companyId: string, status: CompanyStatus, reviewerId: string) {
    const company = await this.companyRepository.findOne({ where: { companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    company.status = status;
    company.reviewerId = reviewerId;
    await this.companyRepository.save(company);
    return { message: `Company status updated successfully` };
  }

  // Get Pending Users (Employees)
  async getPendingUsers() {
    return this.userRepository.find({
      where: {
        status: UserStatus.PENDING,
        role: UserRole.EMPLOYEE
      },
    });
  }

  // Update User Status
  async updateUserStatus(userId: string, status: UserStatus, reviewerId: string, isEmailVerified?: boolean, isPhoneVerified?: boolean) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = status;
    user.reviewerId = reviewerId;
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;
    if (isPhoneVerified !== undefined) user.isPhoneVerified = isPhoneVerified;
    await this.userRepository.save(user);
    return { message: `User status updated successfully` };
  }


  // Get Pending Submissions
  async getPendingSubmissions() {
    return this.submissionRepository.find({
      where: { status: SubmissionStatus.SUBMITTED },
      relations: ['assignedJob', 'assignedJob.job'],
    });
  }

  // Get Pending Payments
  async getPendingPayments() {
    return this.paymentRepository.find({
      where: { paymentStatus: PaymentStatus.PENDING },
      relations: ['job', 'job.company', 'employeeUser'],
    });
  }

  // Release Payment
  async releasePayment(paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId },
      relations: ['job', 'employeeUser']
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.paymentStatus = PaymentStatus.RELEASED;
    await this.paymentRepository.save(payment);

    if (payment.job) {
      payment.job.status = JobStatus.PAID;
      await this.jobRepository.save(payment.job);
    }

    if (payment.employeeUser) {
      const employee = await this.employeeRepository.findOne({
        where: { user: { userId: payment.employeeUser.userId } }
      });
      if (employee) {
        // Convert to number to ensure we do math addition, not string concatenation
        employee.balance = Number(employee.balance || 0) + Number(payment.amount || 0);
        await this.employeeRepository.save(employee);
      }
    }

    return { message: 'Payment released successfully' };
  }

  //Review Work
  async reviewWork(submissionId: string, verifyWorkDto: VerifyWorkDto) {
    const submission = await this.submissionRepository.findOne({
      where: { submissionId },
      relations: ['assignedJob', 'assignedJob.job']
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const reviewer = await this.reviewerRepository.findOne({ where: { reviewerId: verifyWorkDto.reviewerId } });
    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    // Map dto status to entity enums
    let newSubmissionStatus: SubmissionStatus;
    let decision: VerificationDecision;
    let newJobStatus: JobStatus;
    let newAssignedJobStatus: AssignedJobStatus;

    if (verifyWorkDto.status === 'approved') {
      newSubmissionStatus = SubmissionStatus.APPROVED;
      decision = VerificationDecision.APPROVED;
      newJobStatus = JobStatus.APPROVED;
      newAssignedJobStatus = AssignedJobStatus.COMPLETED;
    } else if (verifyWorkDto.status === 'rejected') {
      newSubmissionStatus = SubmissionStatus.REJECTED;
      decision = VerificationDecision.REJECTED;
      newJobStatus = JobStatus.REJECTED;
      newAssignedJobStatus = AssignedJobStatus.IN_PROGRESS;
    } else if (verifyWorkDto.status === 'revision_requested') {
      newSubmissionStatus = SubmissionStatus.REVISION;
      decision = VerificationDecision.REVISION_REQUESTED;
      newJobStatus = JobStatus.IN_PROGRESS;
      newAssignedJobStatus = AssignedJobStatus.IN_PROGRESS;
    } else {
      throw new ConflictException('Invalid status');
    }

    submission.status = newSubmissionStatus;
    await this.submissionRepository.save(submission);

    if (submission.assignedJob) {
      submission.assignedJob.status = newAssignedJobStatus;
      await this.assignedJobRepository.save(submission.assignedJob);

      if (submission.assignedJob.job) {
        submission.assignedJob.job.status = newJobStatus;
        await this.jobRepository.save(submission.assignedJob.job);
      }
    }

    const verification = this.workVerificationRepository.create({
      submission: submission,
      reviewer: reviewer,
      decision: decision,
      comments: verifyWorkDto.comments || null,
    });
    await this.workVerificationRepository.save(verification);

    return {
      message: 'Work submission reviewed successfully',
      submissionId: submissionId,
      verdict: decision,
    };
  }


  // Get Pending Reports
  async getPendingReports() {
    return this.reportRepository.find({
      where: { status: ReportStatus.PENDING },
      relations: ['reportedAgainst', 'job'],
    });
  }

  // Update Report Status
  async updateReportStatus(reportId: string, status: ReportStatus) {
    const report = await this.reportRepository.findOne({ where: { reportId } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.status = status;
    await this.reportRepository.save(report);
    return { message: `Report status updated to ${status}` };
  }

  //Delete Reviewer
  async deleteReviewer(reviewerId: string) {
    const reviewer = await this.reviewerRepository.findOne({
      where: { reviewerId: reviewerId },
      relations: ['user']
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer profile not found');
    }

    // Remove the Reviewer profile first
    await this.reviewerRepository.remove(reviewer);

    // Then remove the core User profile
    if (reviewer.user) {
      await this.userRepository.remove(reviewer.user);
    }

    return { message: 'Reviewer account deleted successfully' };
  }
}