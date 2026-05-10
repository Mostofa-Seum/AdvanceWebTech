import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('verify_company')
export class VerifyCompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => CompanyEntity, (company) => company.verifyCompanies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Column({ type: 'varchar', length: 200 })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  website: string;
}
