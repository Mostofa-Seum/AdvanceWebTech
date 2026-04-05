import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReviewerDto, LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';
import { ReviewerEntity } from './reviewer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ReviewerService {
  constructor(@InjectRepository(ReviewerEntity) private reviewerRepository: Repository<ReviewerEntity>) {}
  getHello(): string {
    return 'Hello World!';
  }
  //Create new reviewer account
  async signup(reviewerDto: CreateReviewerDto) : Promise<ReviewerEntity> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(reviewerDto.password, salt);
    const newReviewerData = {
    ...reviewerDto,
    password: hashedPassword,
  };
  const reviewer = this.reviewerRepository.create(newReviewerData);
  return this.reviewerRepository.save(reviewer);
  }

  //Login for reviewer
  async login(loginDto: LoginDto) {
    const user = await this.reviewerRepository.findOne({ 
    where: { email: loginDto.email } 
  });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }
    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
  if(!isPasswordMatch){
    throw new UnauthorizedException('Invalid email or password');
  }
  const { password, ...result } = user;
  
  return {
    message: 'Login successful',
    user: result,
  };
  }

  //Get reviewer profile
  async getProfile(id: number): Promise<ReviewerEntity> {
    return this.reviewerRepository.findOneBy({ id:  id });
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
