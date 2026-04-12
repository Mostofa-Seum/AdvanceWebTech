import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import type { Response } from 'express';

import { CompanyService } from './company.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  CompanySignupDTO,
  EditJobDTO,
  ReviewEmployeeDTO,
  MakePaymentDTO,
  EditProfileDTO,
  VerifyCompanyDTO,
  ReportEmployeeDTO,
  PostJobDTO,
} from './company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  getHello(): string {
    return this.companyService.getHello();
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('logo', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/i)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  signupCompany(
    @Body() myobj: CompanySignupDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<object> {
    return this.companyService.signupCompany(myobj, file);
  }

  @Get('getimage/:name')
  getImages(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads' });
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  verifyCompany(@Body() myobj: VerifyCompanyDTO): Promise<object> {
    return this.companyService.verifyCompany(myobj);
  }

  @Get('verification-status')
  @UseGuards(AuthGuard)
  getVerificationStatus(
    @Query('companyName') companyName: string,
    @Query('email') email: string,
  ): Promise<object> {
    return this.companyService.getVerificationStatus(companyName, email);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(
    @Query('companyName') companyName: string,
    @Query('email') email: string,
  ): Promise<object> {
    return this.companyService.getProfile(companyName, email);
  }

  @Put('profile/edit')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  editProfile(@Body() myobj: EditProfileDTO): Promise<object> {
    return this.companyService.editProfile(myobj);
  }

  @Post('job')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  postJob(@Body() myobj: PostJobDTO): Promise<object> {
    return this.companyService.postJob(myobj);
  }

  @Get('job/search')
  @UseGuards(AuthGuard)
  getJob(
    @Query('companyName') companyName: string,
    @Query('email') email: string,
  ): Promise<object> {
    return this.companyService.getJob(companyName, email);
  }

  @Put('job/edit/:jobId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  editJob(
    @Param('jobId') jobId: string,
    @Query('companyName') companyName: string,
    @Query('email') email: string,
    @Body() myobj: EditJobDTO,
  ): Promise<object> {
    return this.companyService.editJob(companyName, email, jobId, myobj);
  }

  @Delete('job/remove/:jobId')
  @UseGuards(AuthGuard)
  removeJob(
    @Param('jobId') jobId: string,
    @Query('companyName') companyName: string,
  ): Promise<object> {
    return this.companyService.removeJob(companyName, jobId);
  }

  @Get('job/:jobId/applicants')
  @UseGuards(AuthGuard)
  getApplicants(
    @Param('jobId') jobId: string,
    @Query('companyName') companyName: string,
    @Query('email') email: string,
  ): Promise<object> {
    return this.companyService.getApplicants(companyName, email, jobId);
  }

  @Post('job/:jobId/assign/:applicationId')
  @UseGuards(AuthGuard)
  assignJob(
    @Param('jobId') jobId: string,
    @Param('applicationId') applicationId: string,
    @Body() myobj: { employeeId: string },
  ): Promise<object> {
    return this.companyService.assignJob(jobId, applicationId, myobj);
  }

  @Get('job/:jobId/completed-work')
  @UseGuards(AuthGuard)
  getCompletedWork(
    @Param('jobId') jobId: string,
    @Query('companyName') companyName: string,
    @Query('email') email: string,
  ): Promise<object> {
    return this.companyService.getCompletedWork(companyName, email, jobId);
  }

  @Post('payment')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  makePayment(@Body() myobj: MakePaymentDTO): Promise<object> {
    return this.companyService.makePayment(myobj);
  }

  @Post('review/employee')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  reviewEmployee(@Body() myobj: ReviewEmployeeDTO): Promise<object> {
    return this.companyService.reviewEmployee(myobj);
  }

  @Post('report/employee')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  reportEmployee(@Body() myobj: ReportEmployeeDTO): Promise<object> {
    return this.companyService.reportEmployee(myobj);
  }
}