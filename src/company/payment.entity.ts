import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { UserEntity } from './user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  HELD = 'held',
  RELEASED = 'released',
  FAILED = 'failed',
}

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  paymentId!: string;

  @OneToOne(() => JobEntity, (job) => job.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job!: JobEntity;

  @ManyToOne(() => UserEntity, (user) => user.companyPayments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'companyUserId' })
  companyUser!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.employeePayments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'employeeUserId' })
  employeeUser!: UserEntity;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod!: string;

  @Column({ type: 'varchar', nullable: true })
  transactionId!: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt!: Date;
}