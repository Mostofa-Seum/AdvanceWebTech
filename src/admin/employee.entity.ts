import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ApplicationEntity } from './application.entity';
import { AssignedJobEntity } from './assigned_job.entity';
import { SubmissionEntity } from './submission.entity';

@Entity('employees')
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  employeeId: string;

  @Column({ type: 'text', nullable: true })
  skills: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'varchar', nullable: true })
  portfolio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  trustScore: number;

  @OneToOne(() => UserEntity, (user) => user.employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => ApplicationEntity, (application) => application.employee)
  applications: ApplicationEntity[];

  @OneToMany(() => AssignedJobEntity, (assignedJob) => assignedJob.employee)
  assignedJobs: AssignedJobEntity[];

  @OneToMany(() => SubmissionEntity, (submission) => submission.employee)
  submissions: SubmissionEntity[];
}
