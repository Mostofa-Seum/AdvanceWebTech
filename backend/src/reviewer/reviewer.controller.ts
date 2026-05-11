import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, ParseUUIDPipe, ParseIntPipe, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { ReviewerService } from './reviewer.service';
import { LoginDto, UpdateProfileDto, VerifyWorkDto, ChangePasswordDto } from './reviewer.dto';
import { CreateUserDto } from './user.dto'; 
import { CompanyStatus } from './company.entity';
import { UserStatus } from './user.entity';
import { ReportStatus } from './report.entity';

@Controller('reviewer')
export class ReviewerController {
  constructor(private readonly reviewerService: ReviewerService) {}
  @Post('signup')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', { 
    fileFilter: (req, file, cb) => {
      // Allowing only PDF uploads for reviewer documents/CVs
      if (file.originalname.match(/^.*\.(pdf)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
      }
    },
    limits: { fileSize: 5242880 }, // 5MB limit
    storage: diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      },
    })
  }))
  async signup(
    @Body() userDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {

    if (file) {
      userDto.filename = file.filename; 
    }
    return this.reviewerService.signup(userDto);
  }

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

  @Patch('verify/:id')
  verifyUser(@Param('id', ParseIntPipe) id: number) {
    return this.reviewerService.verifyUser(id);
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

  @Delete(':id')
  async deleteReviewer(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewerService.deleteReviewer(id);
  }
}