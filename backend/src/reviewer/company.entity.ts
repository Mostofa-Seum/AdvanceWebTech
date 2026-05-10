import {Entity,PrimaryGeneratedColumn,Column,OneToOne,JoinColumn, OneToMany,} from 'typeorm';
import { UserEntity } from './user.entity';
import { JobEntity } from './job.entity';
import { VerifyCompanyEntity } from './verify_company.entity';

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

  @OneToOne(() => UserEntity, (user) => user.company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => JobEntity, (job) => job.company)
  jobs: JobEntity[];

  @OneToMany(() => VerifyCompanyEntity, (verifyCompany) => verifyCompany.company)
  verifyCompanies: VerifyCompanyEntity[];
}
