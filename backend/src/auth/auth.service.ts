import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserStatus, UserRole } from '../reviewer/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['reviewer', 'company', 'employee'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Auto-activate employee/company accounts if previously set to pending
    if (user.status === UserStatus.PENDING && (user.role === UserRole.EMPLOYEE || user.role === UserRole.COMPANY)) {
      user.status = UserStatus.ACTIVE;
      await this.userRepository.save(user);
    } else if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException('Your account is pending approval. Please wait.');
    }
    if (user.status === UserStatus.REJECTED) {
      throw new UnauthorizedException('Your account has been rejected.');
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    const { password, ...result } = user;
    const payload = { sub: user.userId, username: user.email, role: user.role };

    return {
      message: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
      user: result,
      reviewerId: user.reviewer?.reviewerId,
      companyId: user.company?.companyId,
      employeeId: user.employee?.employeeId,
    };
  }
}
