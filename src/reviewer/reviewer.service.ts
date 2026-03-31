import { Injectable } from '@nestjs/common';
import { CreateReviewerDto, LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';
import { ReviewerEntity } from './reviewer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ReviewerService {
  constructor(@InjectRepository(ReviewerEntity) private reviewerRepository: Repository<ReviewerEntity>) {}
  getHello(): string {
    return 'Hello World!';
  }
  async signup(reviewerDto: CreateReviewerDto) : Promise<ReviewerEntity> {
    const reviewer = this.reviewerRepository.create(reviewerDto);
    return this.reviewerRepository.save(reviewer);
  }

  login(loginDto: LoginDto) {
    return {
      message: 'Reviewer logged in successfully',
      user: { email: loginDto.email }
    };
  }

  async getProfile(id: number): Promise<ReviewerEntity> {{
    return this.reviewerRepository.findOne({ where: { id } });
  }
  }
  updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    return {
      message: 'Profile updated successfully',
      userId: id,
      updatedData: updateProfileDto
    };
  }
  getUsersToVerify(userType: string) {
    return {
      message: `Verifications for type: ${userType}`,
      users: [
        { id: 101, name: 'Student A', type: userType, status: 'pending' },
        { id: 102, name: 'Student B', type: userType, status: 'pending' }
      ]
    };
  }
  verifyUser(id: number) {
    return {
      message: 'User status updated to Verified',
      userId: id,
      verified: true
    };
  }
  reviewWork(workId: number, verifyWorkDto: VerifyWorkDto) {
    return {
      message: 'Work submission reviewed',
      workId: workId,
      verdict: verifyWorkDto.status,
      score: verifyWorkDto.score
    };
  }

resolveReport(reportId: number) {
    return {
      message: 'Report resolved successfully',
      reportId: reportId
    };
  }
}
