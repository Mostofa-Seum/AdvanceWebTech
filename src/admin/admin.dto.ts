export class AdminLoginDto {
  email: string;
}


export class CreateCompanyDto {
  name: string;
  address: string;
  phone: string;
}

export class UpdateCompanyDto {
  name?: string;
  address?: string;
  phone?: string;
}

export class CreateEmployeeDto {
  name: string;
  email: string;
  companyId: number;
  position: string;
}

export class UpdateEmployeeDto {
  name?: string;
  email?: string;
  position?: string;
}

export class UpdateReviewerDto {
  status: 'approved' | 'suspended' | 'pending';
  notes: string;
}

export class ProcessReportDto {
  action: 'close' | 'delete' | 'warn';
  reason: string;
}
