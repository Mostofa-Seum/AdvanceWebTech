import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { UserEntity } from './user.entity';
import { EmployeeEntity } from './employee.entity';
import { AssignedJobEntity } from './assigned_job.entity'; // Forcing IDE rescan

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('applications')
export class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  applicationId: string;

  @ManyToOne(() => JobEntity, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: JobEntity;

  @ManyToOne(() => UserEntity, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeUserId' })
  employeeUser: UserEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeeEntity;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date;

  @OneToOne(() => AssignedJobEntity, (assignedJob) => assignedJob.application)
  assignedJob: AssignedJobEntity;
}
