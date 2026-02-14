export class CompanySignupDTO {
  companyName: string;
  email: string;
  password: string;
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