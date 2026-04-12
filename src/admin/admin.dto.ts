import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(150)
  fullName: string;
}

export class LoginAdminDto {
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class CreateEmployeeProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Skills are required' })
  skills: string;

  @IsString()
  @IsNotEmpty({ message: 'Experience details are required' })
  experience: string;

  @IsOptional()
  @IsString()
  portfolio?: string;
}

export class UpdateEmployeeProfileDto {
  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  message: string;
}