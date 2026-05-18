import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, Matches, MinLength, IsPhoneNumber } from 'class-validator';
import { UserRole, UserStatus } from './user.entity';

export class CreateUserDto {
  @IsEmail() 
  @IsNotEmpty() 
  email: string;

  @IsString() 
  @IsNotEmpty()
  @MinLength(8) 
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/) 
  fullName: string;

  @IsOptional()
  @Matches(/^0\d{10}$/, { message: 'Phone number must be a valid Bangladeshi number' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;


  @IsOptional()
  @IsString()
  filename?: string;

  @IsEnum(UserRole) 
  @IsNotEmpty()
  role: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}