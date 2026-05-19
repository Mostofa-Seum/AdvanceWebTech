import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseUUIDPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
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
  constructor(private readonly adminService: AdminService) { }

  // admin Auth & Profile

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() dto: CreateAdminDto) {
    return this.adminService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getProfile(id);
  }

  @UseGuards(AuthGuard)
  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminProfileDto
  ) {
    return this.adminService.updateProfile(id, dto);
  }

  @UseGuards(AuthGuard)
  @Patch('profile/:id/change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePasswordDto
  ) {
    return this.adminService.changePassword(id, dto);
  }

  //User Management
  @UseGuards(AuthGuard)
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('users/:id/status')
  @UsePipes(new ValidationPipe())
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto
  ) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @UseGuards(AuthGuard)
  @Patch('users/:id/role')
  @UsePipes(new ValidationPipe())
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto
  ) {
    return this.adminService.updateUserRole(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  //Job Management

  @UseGuards(AuthGuard)
  @Get('jobs')
  async getAllJobs() {
    return this.adminService.getAllJobs();
  }

  @UseGuards(AuthGuard)
  @Patch('jobs/:id/status')
  @UsePipes(new ValidationPipe())
  async updateJobStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobStatusDto
  ) {
    return this.adminService.updateJobStatus(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('jobs/:id')
  async deleteJob(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteJob(id);
  }

  //C ompany Management

  @UseGuards(AuthGuard)
  @Get('companies')
  async getAllCompanies() {
    return this.adminService.getAllCompanies();
  }

  @UseGuards(AuthGuard)
  @Get('companies/:id')
  async getCompanyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getCompanyById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('companies/:id/status')
  @UsePipes(new ValidationPipe())
  async updateCompanyStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyStatusDto
  ) {
    return this.adminService.updateCompanyStatus(id, dto);
  }

  // Reviewer Management

  @UseGuards(AuthGuard)
  @Get('reviewers')
  async getAllReviewers() {
    return this.adminService.getAllReviewers();
  }

  @UseGuards(AuthGuard)
  @Get('reviewers/:id')
  async getReviewerById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getReviewerById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('reviewers/:id/demote')
  async demoteReviewer(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.demoteReviewer(id);
  }

  @UseGuards(AuthGuard)
  @Patch('employees/:id/promote')
  async promoteEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.promoteEmployee(id);
  }

  async getAllEmployees() {
    return this.adminService.getAllEmployees();
  }

  // Reviewer Request Management    
  @UseGuards(AuthGuard)
  @Get('reviewer-requests')
  async getPendingReviewerRequests() {
    return this.adminService.getPendingReviewerRequests();
  }

  @UseGuards(AuthGuard)
  @Patch('reviewer-requests/:id')
  async handleReviewerRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { action: 'accept' | 'reject' }
  ) {
    return this.adminService.handleReviewerRequest(id, body.action);
  }

  // Other Global Management

  @UseGuards(AuthGuard)
  @Get('reports')
  async getAllReports() {
    return this.adminService.getAllReports();
  }

  @UseGuards(AuthGuard)
  @Get('payments')
  async getAllPayments() {
    return this.adminService.getAllPayments();
  }

  @UseGuards(AuthGuard)
  @Get('submissions')
  async getAllSubmissions() {
    return this.adminService.getAllSubmissions();
  }
}
