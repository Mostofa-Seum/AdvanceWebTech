import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { 
  CreateAdminDto, 
  LoginAdminDto, 
  UpdateAdminProfileDto, 
  ChangePasswordDto,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
  UpdateJobStatusDto,
  UpdateCompanyStatusDto
} from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ===================== Admin Auth & Profile =====================

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() dto: CreateAdminDto) {
    return this.adminService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getProfile(id);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateAdminProfileDto
  ) {
    return this.adminService.updateProfile(id, dto);
  }

  @Patch('profile/:id/change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePasswordDto
  ) {
    return this.adminService.changePassword(id, dto);
  }

  // ===================== User Management =====================

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id/status')
  @UsePipes(new ValidationPipe())
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto
  ) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Patch('users/:id/role')
  @UsePipes(new ValidationPipe())
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto
  ) {
    return this.adminService.updateUserRole(id, dto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  // ===================== Job Management =====================

  @Get('jobs')
  async getAllJobs() {
    return this.adminService.getAllJobs();
  }

  @Patch('jobs/:id/status')
  @UsePipes(new ValidationPipe())
  async updateJobStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobStatusDto
  ) {
    return this.adminService.updateJobStatus(id, dto);
  }

  @Delete('jobs/:id')
  async deleteJob(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteJob(id);
  }

  // ===================== Company Management =====================

  @Get('companies')
  async getAllCompanies() {
    return this.adminService.getAllCompanies();
  }

  @Get('companies/:id')
  async getCompanyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getCompanyById(id);
  }

  @Patch('companies/:id/status')
  @UsePipes(new ValidationPipe())
  async updateCompanyStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyStatusDto
  ) {
    return this.adminService.updateCompanyStatus(id, dto);
  }

  // ===================== Reviewer Management =====================

  @Get('reviewers')
  async getAllReviewers() {
    return this.adminService.getAllReviewers();
  }

  @Get('reviewers/:id')
  async getReviewerById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getReviewerById(id);
  }

  @Patch('reviewers/:id/demote')
  async demoteReviewer(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.demoteReviewer(id);
  }

  @Patch('employees/:id/promote')
  async promoteEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.promoteEmployee(id);
  }

  async getAllEmployees() {
    return this.adminService.getAllEmployees();
  }

  // ===================== Other Global Management =====================

  @Get('reports')
  async getAllReports() {
    return this.adminService.getAllReports();
  }

  @Get('payments')
  async getAllPayments() {
    return this.adminService.getAllPayments();
  }

  @Get('submissions')
  async getAllSubmissions() {
    return this.adminService.getAllSubmissions();
  }
}
