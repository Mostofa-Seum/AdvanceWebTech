import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole, UserStatus } from '../admin/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterAdminDto, LoginAdminDto } from '../admin/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async registerAdmin(dto: RegisterAdminDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: UserRole.ADMIN,
      status: UserStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(user);

    // Send a welcome email silently in the background
    this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Welcome to the Platform!',
        text: `Hello ${dto.fullName},\n\nYour account has been created successfully.\n\nThank you!`,
      })
      .catch((err) => {
        console.error('Email Dispatch Failed:', err.message);
      });

    return {
      message: 'Admin registered successfully.',
      userId: savedUser.userId,
    };
  }

  async loginAdmin(dto: LoginAdminDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { sub: user.userId, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
