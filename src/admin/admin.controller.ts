import {
  Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, Query, UsePipes, ValidationPipe,
  UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { extname } from 'path'; 

import { AdminService } from './admin.service';
import {
  AdminLoginDto, CreateCompanyDto, UpdateCompanyDto, CreateEmployeeDto, UpdateReviewerDto, ProcessReportDto, CreateUserCategory3Dto
} from './admin.dto';

@Controller('admin')
@UsePipes(new ValidationPipe())
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

  @Patch('reports/:id') // localhost:3000/admin/reports/10
  processReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() processReportDto: ProcessReportDto,
  ): object {
    return this.adminService.processReport(id, processReportDto);
  }

  // --- FILE UPLOAD LOGIC ---
  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file',
    { 
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/i)) {
           cb(null, true); // Added this to accept the file!
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
        }
      },
      limits: { fileSize: 5242880 }, 
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname)
        },
      })
    }
  ))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { 
      message: "PDF Uploaded Successfully", 
      fileDetails: file 
    };
  }

  // --- USER CATEGORY 3 ENDPOINTS ---

  @Post('users') // localhost:3000/admin/users
  async createUser3(@Body() createUserDto: CreateUserCategory3Dto) {
    return await this.adminService.createUser3(createUserDto);
  }

  @Get('users/search') // localhost:3000/admin/users/search?name=John
  async searchUsersByFullName(@Query('name') nameSubstring: string) {
    return await this.adminService.findUsersByFullName(nameSubstring || '');
  }

  @Get('users/:username') // localhost:3000/admin/users/johndoe123
  async getUserByUsername(@Param('username') username: string) {
    return await this.adminService.findUserByUsername(username);
  }

  @Delete('users/:username') // localhost:3000/admin/users/johndoe123
  async deleteUserByUsername(@Param('username') username: string) {
    return await this.adminService.removeUserByUsername(username);
  }
}