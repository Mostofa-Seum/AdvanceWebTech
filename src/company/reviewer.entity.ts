import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { WorkVerificationEntity } from './work-verification.entity';

@Entity('reviewers')
export class ReviewerEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewerId!: string;

  @Column({ type: 'varchar', nullable: true })
  expertise!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  trustScore!: number;

  @OneToOne(() => UserEntity, (user) => user.reviewer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @OneToMany(() => WorkVerificationEntity, (verification) => verification.reviewer)
  workVerifications!: WorkVerificationEntity[];
}