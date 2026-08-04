import { Injectable, OnApplicationBootstrap, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { JobEntity, JobStatus } from '../reviewer/job.entity';
import { JobCategoryEntity } from '../reviewer/job_category.entity';
import { EmployeeEntity } from '../reviewer/employee.entity';

const DEFAULT_CATEGORIES = ['Development', 'Design', 'Marketing', 'Data'];

@Injectable()
export class PublicService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(JobCategoryEntity)
    private readonly categoryRepository: Repository<JobCategoryEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  /** Seed the default categories the marketing pages filter on, idempotently. */
  async onApplicationBootstrap() {
    for (const name of DEFAULT_CATEGORIES) {
      const exists = await this.categoryRepository.findOne({
        where: { categoryName: name },
      });
      if (!exists) {
        await this.categoryRepository.save(
          this.categoryRepository.create({ categoryName: name }),
        );
      }
    }
  }

  /** List OPEN jobs (public marketplace view), optional filters. */
  async listJobs(category?: string, search?: string) {
    const where: any = { status: JobStatus.OPEN };
    const findOptions: any = {
      where,
      relations: ['category', 'company', 'company.user'],
      order: { deadline: 'DESC' },
    };

    if (search) {
      // Search across title + description (ILike for case-insensitive PG)
      findOptions.where = [
        { status: JobStatus.OPEN, title: ILike(`%${search}%`) },
        { status: JobStatus.OPEN, description: ILike(`%${search}%`) },
      ];
    }

    if (category && category !== 'All') {
      // Filter by category name
      const applyCategory = (w: any) => ({ ...w, category: { categoryName: category } });
      findOptions.where = Array.isArray(findOptions.where)
        ? findOptions.where.map(applyCategory)
        : applyCategory(findOptions.where);
    }

    const jobs = await this.jobRepository.find(findOptions);
    // Strip sensitive user fields
    return jobs.map((job) => this.stripSensitive(job));
  }

  /** Public single-job detail. */
  async getJob(jobId: string) {
    const job = await this.jobRepository.findOne({
      where: { jobId },
      relations: ['category', 'company', 'company.user'],
    });
    if (!job) throw new NotFoundException('Job not found');
    return this.stripSensitive(job);
  }

  /** List all categories (for the filter dropdown). */
  async listCategories() {
    return this.categoryRepository.find({ order: { categoryName: 'ASC' } });
  }

  /** Top-rated employees (Talent showcase). */
  async listTalent() {
    return this.employeeRepository.find({
      where: { user: { status: 'active' } as any },
      relations: ['user'],
      order: { trustScore: 'DESC' },
      take: 12,
    });
  }

  /** Remove password and other sensitive fields from the embedded user. */
  private stripSensitive(job: JobEntity) {
    if (job?.company?.user) {
      delete (job.company.user as any).password;
      delete (job.company.user as any).otp;
      delete (job.company.user as any).otpExpiresAt;
    }
    return job;
  }
}
