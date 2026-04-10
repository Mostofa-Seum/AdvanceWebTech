import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReviewerDto, LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';
import { ReviewerEntity } from './reviewer.entity';
import { UserRole } from './user.entity';
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
      user: {
        fullName: reviewerDto.name,
        email: reviewerDto.email,
        password: hashedPassword,
        role: UserRole.REVIEWER,
      }
    };
    const reviewer = this.reviewerRepository.create(newReviewerData);
    return this.reviewerRepository.save(reviewer);
  }

  //Login for reviewer
  async login(loginDto: LoginDto) {
    const reviewer = await this.reviewerRepository.findOne({ 
      where: { user: { email: loginDto.email } },
      relations: ['user']
    });

    if (!reviewer || !reviewer.user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordMatch = await bcrypt.compare(loginDto.password, reviewer.user.password);
    if(!isPasswordMatch){
      throw new UnauthorizedException('Invalid email or password');
    }
    const { password, ...result } = reviewer.user;
    
    return {
      message: 'Login successful',
      user: result,
      reviewerId: reviewer.reviewerId,
    };
  }

  //Get reviewer profile
  async getProfile(id: string): Promise<ReviewerEntity> {
    return this.reviewerRepository.findOne({
      where: { reviewerId: id },
      relations: ['user']
    });
  }

  //Update reviewer profile
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<ReviewerEntity> {
      const reviewer = await this.reviewerRepository.findOne({
        where: { reviewerId: id },
        relations: ['user']
      });

      if (reviewer && reviewer.user) {
        if (updateProfileDto.name) reviewer.user.fullName = updateProfileDto.name;
        if (updateProfileDto.phone) reviewer.user.phone = updateProfileDto.phone.toString();
        await this.reviewerRepository.save(reviewer);
      }

      return this.reviewerRepository.findOne({
        where: { reviewerId: id },
        relations: ['user']
      });
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
