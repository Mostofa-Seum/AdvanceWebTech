import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  MinLength,
  IsInt,
  MinLength as MinLen,
  Max,
} from 'class-validator';

/** Create / update a job posting. */
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  budget: number;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateJobDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(1) budget?: number;
  @IsOptional() @IsDateString() deadline?: string;
  @IsOptional() @IsString() categoryId?: string;
}

/** Apply-to-job rating payload. */
export class RateDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

/** File a report against a user. */
export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  againstUserId: string;

  @IsOptional()
  @IsString()
  jobId?: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsString()
  details?: string;
}

export class ChangePasswordDto {
  oldPassword: string;

  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}

export class UpdateProfileDto {
  companyName?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  email?: string;
}
