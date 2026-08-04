import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() skills?: string;
  @IsOptional() @IsString() experience?: string;
  @IsOptional() @IsString() portfolio?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() fullName?: string;
}

export class ApplyDto {
  @IsOptional()
  @IsString()
  coverLetter?: string;
}

export class SubmitWorkDto {
  @IsOptional() @IsString() submissionText?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() liveLink?: string;
}

export class RateDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional() @IsString() comment?: string;
}

export class CreateReportDto {
  @IsString() @IsNotEmpty() againstUserId: string;
  @IsOptional() @IsString() jobId?: string;
  @IsString() @IsNotEmpty() reason: string;
  @IsOptional() @IsString() details?: string;
}

export class ChangePasswordDto {
  oldPassword: string;

  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}
