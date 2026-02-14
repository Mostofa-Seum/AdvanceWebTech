import { Injectable } from '@nestjs/common';
import { CreateReviewerDto, LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';
@Injectable()
export class ReviewerService {
  getHello(): string {
    return 'Hello World!';
  }
  signup(reviewerDto: CreateReviewerDto) {
    console.log(reviewerDto.name);
    return {
      message: 'Reviewer registered successfully',
    };
  }

  login(loginDto: LoginDto) {
    return {
      message: 'Reviewer logged in successfully',
      user: { email: loginDto.email }
    };
  }

  getProfile(id: number) {
    return {
      id: id,
      name: 'Seum',
      role: 'Reviewer',
    };
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
