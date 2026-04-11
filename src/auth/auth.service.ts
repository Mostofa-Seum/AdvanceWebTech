import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReviewerService } from '../reviewer/reviewer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: ReviewerService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
        throw new UnauthorizedException();
    }
    
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
const payload = { sub: user.userId, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
} 