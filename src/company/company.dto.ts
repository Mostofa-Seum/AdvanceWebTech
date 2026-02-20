import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CompanySignupDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'companyName should contain only alphabets',
  })
  companyName: string;

  @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9._%+-]+@aiub\.org$/, {
  //   message: 'Email must be a valid @aiub.org email'
  //   })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Nid no. must be exactly 10 digits' })
  nid: string;
}

export class CompanyLoginDTO {
  email: string;
  password: string;
}

export class PostJobDTO {
  companyName: string;
  email: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

export class EditJobDTO {
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
}

export class ReviewEmployeeDTO {
  employeeId: string;
  jobId: string;
  rating: number;
  comment: string;
}

export class MakePaymentDTO {
  jobId: string;
  amount: number;
  method: string;
  transactionRef?: string;
}

export class EditProfileDTO {
  companyName?: string;
  website?: string;
  industry?: string;
  description?: string;
}