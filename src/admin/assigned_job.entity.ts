import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { ApplicationEntity } from './application.entity';
import { EmployeeEntity } from './employee.entity';
import { SubmissionEntity } from './submission.entity';

export enum AssignedJobStatus {
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
}

@Entity('assigned_jobs')
export class AssignedJobEntity {
  @PrimaryGeneratedColumn('uuid')
  assignedJobId: string;

  @OneToOne(() => JobEntity, (job) => job.assignedJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: JobEntity;

  @OneToOne(() => ApplicationEntity, (application) => application.assignedJob, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: ApplicationEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.assignedJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeeEntity;

  @Column({
    type: 'enum',
    enum: AssignedJobStatus,
    default: AssignedJobStatus.ASSIGNED,
  })
  status: AssignedJobStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @OneToMany(() => SubmissionEntity, (submission) => submission.assignedJob)
  submissions: SubmissionEntity[];
}
