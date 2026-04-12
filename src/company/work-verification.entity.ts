import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubmissionEntity } from './submission.entity';
import { ReviewerEntity } from './reviewer.entity';

export enum VerificationDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUESTED = 'revision_requested',
}

@Entity('work_verification')
export class WorkVerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  verificationId!: string;

  @ManyToOne(() => SubmissionEntity, (submission) => submission.verifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'submissionId' })
  submission!: SubmissionEntity;

  @ManyToOne(() => ReviewerEntity, (reviewer) => reviewer.workVerifications, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'reviewerId' })
  reviewer!: ReviewerEntity;

  @Column({
    type: 'enum',
    enum: VerificationDecision,
  })
  decision!: VerificationDecision;

  @Column({ type: 'text', nullable: true })
  comments!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  verifiedAt!: Date;
}