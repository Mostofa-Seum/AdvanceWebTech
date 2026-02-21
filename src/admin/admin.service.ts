import { Injectable } from '@nestjs/common';
import {
  AdminLoginDto,
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateEmployeeDto,
  UpdateReviewerDto,
  ProcessReportDto,
  OptionalFileUploadDto, // Imported the new DTO here as well
} from './admin.dto';

@Injectable()
export class AdminService {
  getHello(): string {
    return 'Admin Module is Working!';
  }

  login(adminLoginDto: AdminLoginDto) {
    return {
      message: 'Admin logged in successfully',
      admin: {
        email: adminLoginDto.email,
        password: adminLoginDto.password, // Included so you can verify it in Postman
      },
    };
  }

  createCompany(createCompanyDto: CreateCompanyDto): object {
    return {
      message: 'Company created successfully',
      company: {
        id: 1,
        ...createCompanyDto,
      },
    };
  }

  updateCompany(id: number, updateCompanyDto: UpdateCompanyDto): object {
    return {
      message: 'Company updated successfully',
      companyId: id,
      updatedData: updateCompanyDto,
    };
  }

  createEmployee(createEmployeeDto: CreateEmployeeDto): object {
    return {
      message: 'Employee created successfully',
      employee: {
        id: 101,
        ...createEmployeeDto,
        status: 'active',
      },
    };
  }

  updateEmployeeStatus(id: number, status: string): object {
    return {
      message: 'Employee status updated successfully',
      employeeId: id,
      newStatus: status,
    };
  }

  manageReviewer(id: number, updateReviewerDto: UpdateReviewerDto): object {
    return {
      message: 'Reviewer updated successfully',
      reviewerId: id,
      updatedData: updateReviewerDto,
    };
  }

  processReport(reportId: number, processReportDto: ProcessReportDto): object {
    return {
      message: 'Report processed successfully',
      reportId: reportId,
      action: processReportDto.action,
      reason: processReportDto.reason,
    };
  }

  // In admin.service.ts
  uploadDocument(file: Express.Multer.File): object {
    return {
      message: 'PDF successfully uploaded and saved to folder',
      fileDetails: {
        originalName: file.originalname,
        savedAs: file.filename,
        path: file.path,
        size: `${(file.size / 1024).toFixed(2)} KB`, 
      },
    };
  }
}