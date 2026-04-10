import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,} from 'typeorm';
import { AssignedJobEntity } from './assigned_job.entity';
import { EmployeeEntity } from './employee.entity';
import { WorkVerificationEntity } from './work_verification.entity';

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  REVISION = 'revision_requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('submissions')
export class SubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  submissionId: string;

  @ManyToOne(() => AssignedJobEntity, (assignedJob) => assignedJob.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignedJobId' })
  assignedJob: AssignedJobEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeeEntity;

  @Column({ type: 'text', nullable: true })
  submissionText: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string;

  @Column({ type: 'varchar', nullable: true })
  liveLink: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.SUBMITTED,
  })
  status: SubmissionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submittedAt: Date;

  @OneToMany(() => WorkVerificationEntity, (verification) => verification.submission)
  verifications: WorkVerificationEntity[];
}
