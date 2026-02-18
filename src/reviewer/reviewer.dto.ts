import {  IsEmail , Matches, MinLength, IsIn, IsPhoneNumber } from 'class-validator';
export class CreateReviewerDto {
    name: string;

    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@aiub\.edu$/, {
    message: 'Email must be a valid @aiub.edu email'
    })
    email: string;

    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @Matches(/[A-Z]/, {message: 'Password must contain at least one uppercase letter',})
    password: string;

  @IsIn(['Male', 'Female'], {
    message: 'Gender must be either Male or Female',})
    gender: string;

    @IsPhoneNumber('BD', {message: 'Phone number must be a valid phone number'})
    phone_number :number;

    
} 
export class LoginDto {
  email: string;
  password: string;
}

export class UpdateProfileDto {
  name: string;
  phone: number;
}

export class VerifyWorkDto {
  score: number;
  comments: string;
  status: 'approved' | 'rejected';
}