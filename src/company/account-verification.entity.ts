import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum AccountVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('account_verification')
export class AccountVerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  verificationId!: string;

  @ManyToOne(() => UserEntity, (user) => user.accountVerifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  documentUrl!: string;

  @Column({
    type: 'enum',
    enum: AccountVerificationStatus,
    default: AccountVerificationStatus.PENDING,
  })
  status!: AccountVerificationStatus;

  @Column({ type: 'text', nullable: true })
  reviewerComment!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submittedAt!: Date;
}