import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
  Max,
  IsEnum,
  IsUrl,
} from 'class-validator';

import { Type } from 'class-transformer';

import { CompanyStatus } from './company.entity';
import { ApplicationStatus } from './application.entity';
import { AssignedJobStatus } from './assigned_job.entity';


// =========================================
// COMPANY SIGNUP
// =========================================

export class CompanySignupDTO {

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[A-Za-z0-9\s.&-]+$/,
    {
      message:
      'companyName contains invalid characters',
    },
  )
  companyName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}


// =========================================
// VERIFY COMPANY
// =========================================

export class VerifyCompanyDTO {

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEnum(
    CompanyStatus,
  )
  status!: CompanyStatus;
}


// =========================================
// POST JOB
// =========================================

export class PostJobDTO {

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @Type(
    () => Number,
  )
  @IsNumber()
  @IsPositive()
  budget!: number;

  @IsString()
  @IsNotEmpty()
  deadline!: string;
}


// =========================================
// EDIT JOB
// =========================================

export class EditJobDTO {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(
    () => Number,
  )
  @IsNumber()
  @IsPositive()
  budget?: number;

  @IsOptional()
  @IsString()
  deadline?: string;
}


// =========================================
// EDIT PROFILE
// =========================================

export class EditProfileDTO {

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;
}


// =========================================
// ASSIGN JOB
// =========================================

export class AssignJobDTO {

  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;
}


// =========================================
// UPDATE APPLICATION
// =========================================

export class UpdateApplicationDTO {

  @IsEnum(
    ApplicationStatus,
  )
  status!: ApplicationStatus;
}


// =========================================
// APPROVE WORK
// =========================================

export class ApproveWorkDTO {

  @IsEnum(
    AssignedJobStatus,
  )
  status!: AssignedJobStatus;

  @IsOptional()
  @IsString()
  feedback?: string;
}


// =========================================
// MAKE PAYMENT
// =========================================

export class MakePaymentDTO {

  @IsUUID()
  @IsNotEmpty()
  jobId!: string;

  @Type(
    () => Number,
  )
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  method!: string;

  @IsOptional()
  @IsString()
  transactionRef?: string;

  @IsUUID()
  @IsNotEmpty()
  companyUserId!: string;

  @IsUUID()
  @IsNotEmpty()
  employeeUserId!: string;
}


// =========================================
// REVIEW EMPLOYEE
// =========================================

export class ReviewEmployeeDTO {

  @IsUUID()
  @IsNotEmpty()
  companyUserId!: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @IsUUID()
  @IsNotEmpty()
  jobId!: string;

  @Type(
    () => Number,
  )
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  comment!: string;
}


// =========================================
// REPORT EMPLOYEE
// =========================================

export class ReportEmployeeDTO {

  @IsUUID()
  @IsNotEmpty()
  companyUserId!: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsUUID()
  jobId?: string;
}