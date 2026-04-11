import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserRole, UserStatus } from './user.entity';
import { ReviewerEntity } from './reviewer.entity';
import { CreateUserDto } from './user.dto';
import { LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';

@Injectable()
export class ReviewerService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewerEntity)
    private readonly reviewerRepository: Repository<ReviewerEntity>,
  ) {}

  //Signup
  async signup(userDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const newUser = this.userRepository.create({
      email: userDto.email,
      password: hashedPassword,
      fullName: userDto.fullName,
      phone: userDto.phone,
      address: userDto.address,
      filename: userDto.filename, 
      role: UserRole.REVIEWER,    
      status: UserStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(newUser);

    const newReviewer = this.reviewerRepository.create({
      user: savedUser, 
      trustScore: 0,
      serviceFee: 0,
    });

    await this.reviewerRepository.save(newReviewer);

    // Removed password for security
    const { password, ...result } = savedUser;
    
    return {
      message: 'Reviewer account created successfully',
      user: result,
    };
  }

  //Login
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ 
      where: { email: loginDto.email, role: UserRole.REVIEWER },
      relations: ['reviewer'] 
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Strip password from output
    const { password, ...result } = user;
    
    return {
      message: 'Login successful',
      user: result,
      reviewerId: user.reviewer.reviewerId, // Handing back the specific reviewer ID
    };
  }


//Get Profile
  async getProfile(reviewerId: string) {
    const reviewer = await this.reviewerRepository.findOne({
      where: { reviewerId: reviewerId },
      relations: ['user'] // Pulls the connected UserEntity data
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer profile not found');
    }

    // Strip password before returning
    delete reviewer.user.password;
    return reviewer;
  }

  //Update Profile
  async updateProfile(reviewerId: string, updateProfileDto: UpdateProfileDto) {
    const reviewer = await this.reviewerRepository.findOne({
      where: { reviewerId: reviewerId },
      relations: ['user']
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer profile not found');
    }

    // Update the Hub (User properties)
    if (updateProfileDto.name) reviewer.user.fullName = updateProfileDto.name;
    if (updateProfileDto.phone) reviewer.user.phone = updateProfileDto.phone;
    
    // Update the Spoke (Reviewer properties)
    if (updateProfileDto.expertise) reviewer.expertise = updateProfileDto.expertise;
    if (updateProfileDto.serviceFee) reviewer.serviceFee = updateProfileDto.serviceFee;

    // Save changes. TypeORM is smart enough to update both tables via cascades.
    await this.userRepository.save(reviewer.user);
    await this.reviewerRepository.save(reviewer);

    return { message: 'Profile updated successfully' };
  }

  //Get Users To Verify
  getUsersToVerify(type: string) {
    // Mock response. Later, query AccountVerificationEntity.
    return {
      message: `Fetching unverified users of type: ${type}`,
      users: [
        { id: 101, name: 'Student A', type: type, status: 'pending' },
      ]
    };
  }

  //Verify User
  verifyUser(id: number) {
    // Mock response. Later, update AccountVerificationEntity status.
    return {
      message: 'User identity verified successfully',
      userId: id,
    };
  }

  //Review Work
  reviewWork(workId: number, verifyWorkDto: VerifyWorkDto) {
     // Mock response. Later, create a new WorkVerificationEntity.
    return {
      message: 'Work submission reviewed',
      workId: workId,
      verdict: verifyWorkDto.status,
    };
  }


  //Delete Reviewer
  async deleteReviewer(reviewerId: string) {
    const reviewer = await this.reviewerRepository.findOne({
      where: { reviewerId: reviewerId },
      relations: ['user']
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer profile not found');
    }

    // Remove the Reviewer profile first
    await this.reviewerRepository.remove(reviewer);
    
    // Then remove the core User profile
    if (reviewer.user) {
      await this.userRepository.remove(reviewer.user);
    }

    return { message: 'Reviewer account deleted successfully' };
  }
}