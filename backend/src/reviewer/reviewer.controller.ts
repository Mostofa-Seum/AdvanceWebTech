import { Controller, Get, Post, Put, Patch, Body, Param, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewerService } from './reviewer.service';
import { LoginDto, UpdateProfileDto, VerifyWorkDto, ChangePasswordDto } from './reviewer.dto';
import { CompanyStatus } from './company.entity';
import { UserStatus } from './user.entity';
import { ReportStatus } from './report.entity';

@Controller('reviewer')
export class ReviewerController {
  constructor(private readonly reviewerService: ReviewerService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.reviewerService.login(loginDto);
  }

  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewerService.getProfile(id);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.reviewerService.updateProfile(id, updateProfileDto);
  }

  @Patch('profile/:id/change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.reviewerService.changePassword(id, changePasswordDto);
  }

  @Get('companies/pending')
  async getPendingCompanies() {
    return this.reviewerService.getPendingCompanies();
  }

  @Patch('companies/:id/status')
  async updateCompanyStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: CompanyStatus, reviewerId: string }
  ) {
    return this.reviewerService.updateCompanyStatus(id, body.status, body.reviewerId);
  }

  @Get('users/pending')
  async getPendingUsers() {
    return this.reviewerService.getPendingUsers();
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: UserStatus, reviewerId: string, isEmailVerified: boolean, isPhoneVerified: boolean }
  ) {
    return this.reviewerService.updateUserStatus(id, body.status, body.reviewerId, body.isEmailVerified, body.isPhoneVerified);
  }

  @Get('work/pending')
  async getPendingSubmissions() {
    return this.reviewerService.getPendingSubmissions();
  }

  @Get('payments/pending')
  async getPendingPayments() {
    return this.reviewerService.getPendingPayments();
  }

  @Patch('payments/:id/release')
  async releasePayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewerService.releasePayment(id);
  }

  @Post('work/:submissionId/review')
  async reviewWork(
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() verifyWorkDto: VerifyWorkDto
  ) {
    return this.reviewerService.reviewWork(submissionId, verifyWorkDto);
  }

  @Get('reports/pending')
  async getPendingReports() {
    return this.reviewerService.getPendingReports();
  }

  @Patch('reports/:id/status')
  async updateReportStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: ReportStatus }
  ) {
    return this.reviewerService.updateReportStatus(id, body.status);
  }

}