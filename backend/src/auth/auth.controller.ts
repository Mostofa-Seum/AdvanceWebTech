import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response, Request } from 'express'; 
import { LoginDto, RegisterDto } from './auth.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(
      body.email,
      body.password,
    );

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      path: '/',
      maxAge: 3600 * 1000,
    });

    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  // 🆕 ADD THIS REGISTRATION ENDPOINT
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const newUser = await this.authService.register(body);
    return {
      message: 'Registration successful',
      user: newUser,
    };
  }

  // 🟢 NEW ADDITION: Systematic Logout Endpoint matching your Navbar API calls
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Overwrite cookie attributes to expire it instantly inside the browser lifecycle
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      path: '/',
      expires: new Date(0), // Forces erasure by jumping back to Jan 1, 1970
    });

    return {
      message: 'Logged out successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req['user'];
  }
}