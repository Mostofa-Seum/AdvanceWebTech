import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { MulterError, diskStorage } from 'multer';

import type { Response, Request } from 'express';

import { CompanyService } from './company.service';

import { AuthGuard } from '../auth/auth.guard';

import {
  CompanySignupDTO,
  EditJobDTO,
  EditProfileDTO,
  MakePaymentDTO,
  PostJobDTO,
  ReportEmployeeDTO,
  ReviewEmployeeDTO,
  VerifyCompanyDTO,
  AssignJobDTO,
  UpdateApplicationDTO,
  ApproveWorkDTO,
} from './company.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) { }

  // =========================================
  // SIGNUP
  // =========================================

  @Post('signup')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('logo', {
      fileFilter: (req, file, cb) => {
        if (
          file.originalname.match(
            /^.*\.(jpg|jpeg|png|webp)$/i,
          )
        ) {
          cb(null, true);
        } else {
          cb(
            new MulterError(
              'LIMIT_UNEXPECTED_FILE',
              'image',
            ),
            false,
          );
        }
      },

      limits: {
        fileSize: 2 * 1024 * 1024,
      },

      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, cb) => {
          cb(
            null,
            Date.now() +
            '_' +
            file.originalname,
          );
        },
      }),
    }),
  )
  signupCompany(
    @Body() myobj: CompanySignupDTO,

    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<object> {
    return this.companyService.signupCompany(
      myobj,
      file,
    );
  }


  // =========================================
  // VERIFY COMPANY
  // =========================================

  @Post('verify')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  verifyCompany(
    @Body() myobj: VerifyCompanyDTO,
  ): Promise<object> {
    return this.companyService.verifyCompany(
      myobj,
    );
  }

  // =========================================
  // PROFILE
  // =========================================

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(
    @Query('companyName')
    companyName: string,
  ): Promise<object> {
    return this.companyService.getProfile(
      companyName,
    );
  }

  @Put('profile/edit')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  editProfile(
    @Body() myobj: EditProfileDTO,
  ): Promise<object> {
    return this.companyService.editProfile(
      myobj,
    );
  }

  // =========================================
  // JOB
  // =========================================

  @Post('job')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  postJob(
    @Body() myobj: PostJobDTO,
  ): Promise<object> {
    return this.companyService.postJob(
      myobj,
    );
  }

  @Get('job/search')
  @UseGuards(AuthGuard)
  getJob(
    @Query('companyName')
    companyName: string,
  ): Promise<object> {
    return this.companyService.getJob(
      companyName,
    );
  }

  @Put('job/edit/:jobId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  editJob(
    @Param('jobId')
    jobId: string,

    @Query('companyName')
    companyName: string,

    @Body()
    myobj: EditJobDTO,
  ): Promise<object> {
    return this.companyService.editJob(
      companyName,
      jobId,
      myobj,
    );
  }

  @Delete('job/remove/:jobId')
  @UseGuards(AuthGuard)
  removeJob(
    @Param('jobId')
    jobId: string,

    @Query('companyName')
    companyName: string,
  ): Promise<object> {
    return this.companyService.removeJob(
      companyName,
      jobId,
    );
  }

  // Add this block under your JOB or REVIEW EMPLOYEE section
  @Get('completed-contracts')
  @UseGuards(AuthGuard)
  async getCompletedContracts(@Req() req: Request): Promise<object[]> {
    // Extract the logged-in user's ID from the AuthGuard request payload
    const companyUserId = req['user'].userId;
    return this.companyService.getCompletedContracts(companyUserId);
  }

  // =========================================
  // APPLICANTS
  // =========================================

  @Get('job/:jobId/applicants')
  @UseGuards(AuthGuard)
  getApplicants(
    @Param('jobId')
    jobId: string,
  ): Promise<object> {
    return this.companyService.getApplicants(
      jobId,
    );
  }

  // =========================================
  // ACCEPT / REJECT APPLICANT
  // =========================================

  @Put('application/:applicationId/status')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateApplicationStatus(
    @Param('applicationId')
    applicationId: string,

    @Body()
    myobj: UpdateApplicationDTO,
  ): Promise<object> {
    return this.companyService.updateApplicationStatus(
      applicationId,
      myobj,
    );
  }

  // =========================================
  // ASSIGN JOB
  // =========================================

  @Post(
    'job/:jobId/assign/:applicationId',
  )
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  assignJob(
    @Param('jobId')
    jobId: string,

    @Param('applicationId')
    applicationId: string,

    @Body()
    myobj: AssignJobDTO,
  ): Promise<object> {
    return this.companyService.assignJob(
      jobId,
      applicationId,
      myobj,
    );
  }

  // =========================================
  // TRACK JOB STATUS
  // =========================================

  @Get('job/:jobId/status')
  @UseGuards(AuthGuard)
  trackJobStatus(
    @Param('jobId')
    jobId: string,
  ): Promise<object> {
    return this.companyService.trackJobStatus(
      jobId,
    );
  }

  // =========================================
  // COMPLETED WORK
  // =========================================

  @Get('job/:jobId/completed-work')
  @UseGuards(AuthGuard)
  getCompletedWork(
    @Param('jobId')
    jobId: string,

    @Query('companyName')
    companyName: string,
  ): Promise<object> {
    return this.companyService.getCompletedWork(
      companyName,
      jobId,
    );
  }

  // =========================================
  // APPROVE WORK / REQUEST REVISION
  // =========================================

  @Put('assigned-job/:assignedJobId/review')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  approveOrRevision(
    @Param('assignedJobId')
    assignedJobId: string,

    @Body()
    myobj: ApproveWorkDTO,
  ): Promise<object> {
    return this.companyService.approveOrRequestRevision(
      assignedJobId,
      myobj,
    );
  }

  // =========================================
  // PAYMENT
  // =========================================

  @Post('payment')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  makePayment(
    @Body() myobj: MakePaymentDTO,
  ): Promise<object> {
    return this.companyService.makePayment(
      myobj,
    );
  }

  // =========================================
  // REVIEW EMPLOYEE
  // =========================================

  @Post('review/employee')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  reviewEmployee(
    @Body()
    myobj: ReviewEmployeeDTO,
  ): Promise<object> {
    return this.companyService.reviewEmployee(
      myobj,
    );
  }

  // =========================================
  // REPORT EMPLOYEE
  // =========================================

  @Post('report/employee')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  reportEmployee(
    @Body()
    myobj: ReportEmployeeDTO,
  ): Promise<object> {
    return this.companyService.reportEmployee(
      myobj,
    );
  }
}