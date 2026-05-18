import {  IsEmail , Matches, MinLength, IsIn, IsPhoneNumber } from 'class-validator';
export class CreateReviewerDto {
  name: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@aiub\.edu$/, {
    message: 'Email must be a valid @aiub.edu email'
  })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class UpdateProfileDto {
  name?: string;
  phone?: string;
  expertise?: string;
  serviceFee?: number;
  email?: string;
  address?: string;
  trustScore?: number;
}

export class VerifyWorkDto {
  reviewerId: string;
  status: 'approved' | 'rejected' | 'revision_requested';
  comments?: string;
}

export class ChangePasswordDto {
  oldPassword: string;

  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  email: string;
  otp: string;
  
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}