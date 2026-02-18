import { isEmail, IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateReviewerDto {
    name: string;

    @IsEmail()
    email: string;

    password: string;
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