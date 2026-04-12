import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';
import { JobCategoryEntity } from './job-category.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned-job.entity';
import { RatingReviewEntity } from './rating-review.entity';
import { PaymentEntity } from './payment.entity';
import { ReportEntity } from './report.entity';

export enum JobStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  REMOVED = 'removed',
}

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  jobId!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  budget!: number;

  @Column({ type: 'date' })
  deadline!: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status!: JobStatus;

  @ManyToOne(() => JobCategoryEntity, (category) => category.jobs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category!: JobCategoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.postedJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyUserId' })
  companyUser!: UserEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: CompanyEntity;

  @OneToMany(() => ApplicationEntity, (application) => application.job)
  applications!: ApplicationEntity[];

  @OneToOne(() => AssignedJobEntity, (assignedJob) => assignedJob.job)
  assignedJob!: AssignedJobEntity;

  @OneToMany(() => RatingReviewEntity, (review) => review.job)
  reviews!: RatingReviewEntity[];

  @OneToOne(() => PaymentEntity, (payment) => payment.job)
  payment!: PaymentEntity;

  @OneToMany(() => ReportEntity, (report) => report.job)
  reports!: ReportEntity[];
}
