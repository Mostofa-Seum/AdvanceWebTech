import { Injectable, UnauthorizedException, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity, UserRole, UserStatus } from '../reviewer/user.entity';
import { JobEntity, JobStatus } from '../reviewer/job.entity';
import { CompanyEntity, CompanyStatus } from '../reviewer/company.entity';
import { ReviewerEntity } from '../reviewer/reviewer.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';
import { ReportEntity, ReportStatus } from '../reviewer/report.entity';
import { PaymentEntity } from '../reviewer/payment.entity';
import { SubmissionEntity } from '../reviewer/submission.entity';

import { 
  CreateAdminDto, 
  LoginAdminDto, 
  UpdateAdminProfileDto, 
  ChangePasswordDto,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
  UpdateJobStatusDto,
  UpdateCompanyStatusDto
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ReviewerEntity)
    private readonly reviewerRepository: Repository<ReviewerEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
  ) {}

  // ===================== Admin Auth & Profile =====================

  async signup(adminDto: CreateAdminDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: adminDto.email },
        { phone: adminDto.phone }
      ]
    });

    if (existingUser) {
      throw new ConflictException('A user with this email or phone number already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(adminDto.password, salt);

    const newAdmin = this.userRepository.create({
      email: adminDto.email,
      password: hashedPassword,
      fullName: adminDto.fullName,
      phone: adminDto.phone,
      address: adminDto.address,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE, // Admins might be active by default or pending
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    const savedAdmin = await this.userRepository.save(newAdmin);
    const { password, ...result } = savedAdmin;

    return {
      message: 'Admin account created successfully',
      user: result,
    };
  }

  async login(loginDto: LoginAdminDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, role: UserRole.ADMIN }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password, ...result } = user;

    return {
      message: 'Login successful',
      user: result,
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.userRepository.findOne({
      where: { userId: adminId, role: UserRole.ADMIN }
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    delete admin.password;
    return admin;
  }

  async updateProfile(adminId: string, dto: UpdateAdminProfileDto) {
    const admin = await this.userRepository.findOne({
      where: { userId: adminId, role: UserRole.ADMIN }
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    if (dto.fullName) admin.fullName = dto.fullName;
    if (dto.phone) admin.phone = dto.phone;
    if (dto.address) admin.address = dto.address;
    if (dto.email) admin.email = dto.email;

    await this.userRepository.save(admin);

    return { message: 'Profile updated successfully' };
  }

  async changePassword(adminId: string, dto: ChangePasswordDto) {
    const admin = await this.userRepository.findOne({
      where: { userId: adminId, role: UserRole.ADMIN }
    });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(dto.newPassword, salt);
    await this.userRepository.save(admin);

    return { message: 'Password changed successfully' };
  }

  // ===================== User Management =====================

  async getAllUsers() {
    const users = await this.userRepository.find({ relations: ['employee', 'reviewer', 'company'] });
    return users.map(u => { delete u.password; return u; });
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId }, relations: ['employee', 'company', 'reviewer'] });
    if (!user) throw new NotFoundException('User not found');
    delete user.password;
    return user;
  }

  async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    user.status = dto.status;
    await this.userRepository.save(user);

    return { message: `User status updated to ${dto.status}` };
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    // Only allow employee <-> reviewer transitions
    const allowed =
      (user.role === UserRole.EMPLOYEE && dto.role === UserRole.REVIEWER) ||
      (user.role === UserRole.REVIEWER && dto.role === UserRole.EMPLOYEE);

    if (!allowed) {
      throw new BadRequestException(
        'Only employee ↔ reviewer role changes are permitted.',
      );
    }

    user.role = dto.role;
    await this.userRepository.save(user);

    return { message: `User role updated to ${dto.role}` };
  }

  async promoteEmployee(employeeId: string) {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const user = employee.user;
    if (!user) throw new NotFoundException('Associated user not found');

    // Change role to reviewer
    user.role = UserRole.REVIEWER;
    await this.userRepository.save(user);

    // Create a reviewer profile
    const newReviewer = this.reviewerRepository.create({
      user: user,
      trustScore: 0,
      serviceFee: 0,
    });
    await this.reviewerRepository.save(newReviewer);

    // Remove old employee profile
    await this.employeeRepository.remove(employee);

    return { message: 'Employee promoted to reviewer successfully' };
  }

  async getAllEmployees() {
    return this.employeeRepository.find({ relations: ['user'] });
  }

  // ===================== Job Management =====================

  async getAllJobs() {
    return this.jobRepository.find({ relations: ['company', 'category'] });
  }

  async updateJobStatus(jobId: string, dto: UpdateJobStatusDto) {
    const job = await this.jobRepository.findOne({ where: { jobId } });
    if (!job) throw new NotFoundException('Job not found');

    job.status = dto.status;
    await this.jobRepository.save(job);
    return { message: `Job status updated to ${dto.status}` };
  }

  async deleteJob(jobId: string) {
    const job = await this.jobRepository.findOne({ where: { jobId } });
    if (!job) throw new NotFoundException('Job not found');

    await this.jobRepository.remove(job);
    return { message: 'Job deleted successfully' };
  }

  // ===================== Company Management =====================

  async getAllCompanies() {
    return this.companyRepository.find({ relations: ['user'] });
  }

  async getCompanyById(companyId: string) {
    const company = await this.companyRepository.findOne({ where: { companyId }, relations: ['user', 'jobs'] });
    if (!company) throw new NotFoundException('Company not found');
    if (company.user) {
      delete company.user.password;
    }
    return company;
  }

  async updateCompanyStatus(companyId: string, dto: UpdateCompanyStatusDto) {
    const company = await this.companyRepository.findOne({ where: { companyId } });
    if (!company) throw new NotFoundException('Company not found');

    company.status = dto.status;
    await this.companyRepository.save(company);
    return { message: `Company status updated to ${dto.status}` };
  }

  // ===================== Reviewer Management =====================

  async getAllReviewers() {
    return this.reviewerRepository.find({ relations: ['user'] });
  }

  async getReviewerById(reviewerId: string) {
    const reviewer = await this.reviewerRepository.findOne({ where: { reviewerId }, relations: ['user'] });
    if (!reviewer) throw new NotFoundException('Reviewer not found');
    if (reviewer.user) {
      delete reviewer.user.password;
    }
    return reviewer;
  }

  async demoteReviewer(reviewerId: string) {
    const reviewer = await this.reviewerRepository.findOne({ where: { reviewerId }, relations: ['user'] });
    if (!reviewer) throw new NotFoundException('Reviewer not found');

    const user = reviewer.user;
    if (user) {
      user.role = UserRole.EMPLOYEE; // Or a general user role, depending on system
      await this.userRepository.save(user);
      
      // Also create an employee profile since they are now an employee
      const newEmployee = this.employeeRepository.create({
        user: user,
        balance: 0,
      });
      await this.employeeRepository.save(newEmployee);
    }

    // Delete reviewer profile
    await this.reviewerRepository.remove(reviewer);
    return { message: 'Reviewer demoted to employee successfully' };
  }

  // ===================== Reviewer Request Management =====================

  async getPendingReviewerRequests() {
    const pendingReviewers = await this.userRepository.find({
      where: {
        role: UserRole.REVIEWER,
        status: UserStatus.PENDING,
      },
      order: { createdAt: 'DESC' },
    });

    return pendingReviewers.map(u => {
      delete u.password;
      return u;
    });
  }

  async handleReviewerRequest(userId: string, action: 'accept' | 'reject') {
    const user = await this.userRepository.findOne({
      where: { userId, role: UserRole.REVIEWER, status: UserStatus.PENDING },
    });

    if (!user) {
      throw new NotFoundException('Pending reviewer request not found');
    }

    if (action === 'accept') {
      user.status = UserStatus.ACTIVE;
      await this.userRepository.save(user);
      return { message: 'Reviewer request accepted. User is now active.' };
    } else {
      user.status = UserStatus.REJECTED;
      await this.userRepository.save(user);
      return { message: 'Reviewer request rejected.' };
    }
  }

  // ===================== Other Global Management =====================

  async getAllReports() {
    return this.reportRepository.find({ relations: ['reportedBy', 'reportedAgainst', 'job'] });
  }

  async getAllPayments() {
    return this.paymentRepository.find({ relations: ['job', 'companyUser', 'employeeUser'] });
  }

  async getAllSubmissions() {
    return this.submissionRepository.find({ relations: ['assignedJob', 'assignedJob.job'] });
  }
}
