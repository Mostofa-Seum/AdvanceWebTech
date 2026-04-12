import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('job_categories')
export class JobCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  categoryName: string;

  @OneToMany(() => JobEntity, (job) => job.category)
  jobs: JobEntity[];
}
