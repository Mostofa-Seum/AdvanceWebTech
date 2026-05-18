import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './auth.dto'; // Or import CompanySignupDTO directly

@Injectable()
export class AuthService {
  constructor(
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) { }

  // 🔌 Bridge the controller payload to your comprehensive database transaction method
  async register(dto: RegisterDto): Promise<any> {
    // We forward the payload structure cleanly to your pre-existing logic
    return this.companyService.signupCompany({
      companyName: dto.companyName,
      email: dto.email,
      password: dto.password,
      description: dto.description,
      website: dto.website,
    });
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.companyService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    return {
  access_token: await this.jwtService.signAsync(payload),
  user: {
    userId: user.userId,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  },
};
  }
}