import {Entity,PrimaryGeneratedColumn,Column,OneToOne,JoinColumn, OneToMany,} from 'typeorm';
import { JobEntity } from './job.entity';

export enum CompanyStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  companyId: string;

  @Column({ type: 'varchar', length: 200 })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  website: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  trustScore: number;

  @OneToMany(() => JobEntity, (job) => job.company)
  jobs: JobEntity[];

  @Column({ type: 'uuid', nullable: true })
  reviewerId: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.PENDING,
  })
  status: CompanyStatus;
}
