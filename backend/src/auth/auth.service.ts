import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReviewerService } from '../reviewer/reviewer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private reviewerService: ReviewerService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const loginResult = await this.reviewerService.login({ email, password: pass });
    const payload = { sub: loginResult.user.userId, username: loginResult.user.email, role: loginResult.user.role };
    return {
      message: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
      user: loginResult.user,
      reviewerId: loginResult.reviewerId
    };
  }
}
