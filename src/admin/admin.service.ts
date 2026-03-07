import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserCategory3Entity } from './admin.entity';
import {
  AdminLoginDto,
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateEmployeeDto,
  UpdateReviewerDto,
  ProcessReportDto,
  OptionalFileUploadDto, 
  CreateUserCategory3Dto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserCategory3Entity)
    private readonly userRepository: Repository<UserCategory3Entity>,
  ) {}

  getHello(): string {
    return 'Admin Module is Working!';
  }

  login(adminLoginDto: AdminLoginDto) {
    return {
      message: 'Admin logged in successfully',
      admin: {
        email: adminLoginDto.email,
        password: adminLoginDto.password, 
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

  // --- USER CATEGORY 3 OPERATIONS ---

  async createUser3(createUserDto: CreateUserCategory3Dto): Promise<UserCategory3Entity> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findUsersByFullName(substring: string): Promise<UserCategory3Entity[]> {
    return await this.userRepository.find({
      where: {
        fullName: Like(`%${substring}%`),
      },
    });
  }

  async findUserByUsername(username: string): Promise<UserCategory3Entity> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async removeUserByUsername(username: string): Promise<object> {
    const user = await this.findUserByUsername(username); 
    await this.userRepository.remove(user);
    return { message: `User ${username} successfully deleted` };
  }
}