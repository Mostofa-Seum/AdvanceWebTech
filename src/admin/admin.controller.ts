import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import {
  AdminLoginDto,
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateReviewerDto,
  ProcessReportDto,
} from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get() // localhost:3000/admin
  getHello(): string {
    return this.adminService.getHello();
  }

  @Post('login') // localhost:3000/admin/login
login(@Body() adminLoginDto: AdminLoginDto): object {
  return this.adminService.login(adminLoginDto);
}


  @Post('companies') // localhost:3000/admin/companies
  createCompany(@Body() createCompanyDto: CreateCompanyDto): object {
    return this.adminService.createCompany(createCompanyDto);
  }

  @Put('companies/:id') // localhost:3000/admin/companies/1
  updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): object {
    return this.adminService.updateCompany(id, updateCompanyDto);
  }

  @Post('employees') // localhost:3000/admin/employees
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): object {
    return this.adminService.createEmployee(createEmployeeDto);
  }

  @Patch('employees/:id/status') // localhost:3000/admin/employees/2/status?status=active
  updateEmployeeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: string,
  ): object {
    return this.adminService.updateEmployeeStatus(id, status);
  }

  @Patch('reviewers/:id') // localhost:3000/admin/reviewers/3
  manageReviewer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewerDto: UpdateReviewerDto,
  ): object {
    return this.adminService.manageReviewer(id, updateReviewerDto);
  }

  @Delete('reports/:id') // localhost:3000/admin/reports/10
  processReport(@Param('id', ParseIntPipe) id: number): object {
    return this.adminService.processReport(id);
  }
}
