import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CompanySignupDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s.&-]+$/, {
    message: 'companyName contains invalid characters',
  })
  companyName!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class VerifyCompanyDTO {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;
}

export class PostJobDTO {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  budget!: number;

  @IsString()
  @IsNotEmpty()
  deadline!: string;
}

export class EditJobDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  budget?: number;

  @IsOptional()
  @IsString()
  deadline?: string;
}

export class EditProfileDTO {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class MakePaymentDTO {
  @IsString()
  @IsNotEmpty()
  jobId!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  method!: string;

  @IsOptional()
  @IsString()
  transactionRef?: string;
}

export class ReviewEmployeeDTO {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  jobId!: string;

  @Type(() => Number)
  @IsNumber()
  rating!: number;

  @IsString()
  @IsNotEmpty()
  comment!: string;
}

export class ReportEmployeeDTO {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  jobId?: string;
}