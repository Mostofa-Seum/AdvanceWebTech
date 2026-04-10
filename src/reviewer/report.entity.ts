import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,} from 'typeorm';
import { UserEntity } from './user.entity';
import { JobEntity } from './job.entity';

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  reportId: string;

  @ManyToOne(() => UserEntity, (user) => user.reportsCreated, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportedById' })
  reportedBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reportsReceived, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reportedAgainstId' })
  reportedAgainst: UserEntity;

  @ManyToOne(() => JobEntity, (job) => job.reports, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'jobId' })
  job: JobEntity;

  @Column({ type: 'varchar', length: 200 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
