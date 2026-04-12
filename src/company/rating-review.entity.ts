import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { JobEntity } from './job.entity';

@Entity('ratings_reviews')
export class RatingReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewId!: string;

  @ManyToOne(() => JobEntity, (job) => job.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job!: JobEntity;

  @ManyToOne(() => UserEntity, (user) => user.givenReviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toUserId' })
  toUser!: UserEntity;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
