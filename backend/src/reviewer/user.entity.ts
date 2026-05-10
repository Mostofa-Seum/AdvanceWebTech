import {Entity,PrimaryGeneratedColumn,Column,OneToOne,OneToMany,} from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { CompanyEntity } from './company.entity';
import { ReviewerEntity } from './reviewer.entity';
import { JobEntity } from './job.entity';
import { ApplicationEntity } from './application.entity';
import { RatingReviewEntity } from './rating_review.entity';
import { PaymentEntity } from './payment.entity';
import { ReportEntity } from './report.entity';
import { NotificationEntity } from './notification.entity';
import { VerifyUsersEntity } from './verify_users.entity';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  COMPANY = 'company',
  REVIEWER = 'reviewer',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  filename: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',default: () => 'CURRENT_TIMESTAMP',onUpdate: 'CURRENT_TIMESTAMP',})
  updatedAt: Date;

  @OneToOne(() => EmployeeEntity, (employee) => employee.user)
  employee: EmployeeEntity;

  @OneToOne(() => CompanyEntity, (company) => company.user)
  company: CompanyEntity;

  @OneToOne(() => ReviewerEntity, (reviewer) => reviewer.user)
  reviewer: ReviewerEntity;

  @OneToMany(() => JobEntity, (job) => job.companyUser)
  postedJobs: JobEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.employeeUser)
  applications: ApplicationEntity[];

  @OneToMany(() => RatingReviewEntity, (review) => review.fromUser)
  givenReviews: RatingReviewEntity[];

  @OneToMany(() => RatingReviewEntity, (review) => review.toUser)
  receivedReviews: RatingReviewEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.companyUser)
  companyPayments: PaymentEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.employeeUser)
  employeePayments: PaymentEntity[];

  @OneToMany(() => ReportEntity, (report) => report.reportedBy)
  reportsCreated: ReportEntity[];

  @OneToMany(() => ReportEntity, (report) => report.reportedAgainst)
  reportsReceived: ReportEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => VerifyUsersEntity, (verifyUser) => verifyUser.user)
  verifyUsers: VerifyUsersEntity[];
}
