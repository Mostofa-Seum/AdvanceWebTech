import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  Matches, 
  MinLength, 
  MaxLength,
  IsNumber, 
  IsIn, 
  IsNotEmpty 
} from 'class-validator';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase character' })
  password: string;
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain any special characters' })
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^01/, { message: 'Phone Number field must start with 01' })
  phone: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain any special characters' })
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01/, { message: 'Phone Number field must start with 01' })
  phone?: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain any special characters' })
  name: string;

  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsString()
  @IsNotEmpty()
  position: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain any special characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  position?: string;
}

export class UpdateReviewerDto {
  @IsString()
  @IsIn(['approved', 'suspended', 'pending'], { message: 'Invalid status' })
  status: 'approved' | 'suspended' | 'pending';

  @IsString()
  @IsOptional()
  notes: string;
}

export class ProcessReportDto {
  @IsString()
  @IsIn(['close', 'delete', 'warn'], { message: 'Invalid action' })
  action: 'close' | 'delete' | 'warn';

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class OptionalFileUploadDto {
  @IsOptional()
  @IsString()
  @Matches(/\.pdf$/i, { message: 'Uploaded file must be in PDF format' })
  fileName?: string;
}

// --- NEW USER CATEGORY 3 DTO ---
export class CreateUserCategory3Dto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Username cannot exceed 100 characters' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150, { message: 'Full name cannot exceed 150 characters' })
  fullName: string;
}