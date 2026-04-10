import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, Query, ValidationPipe, UsePipes, UseInterceptors, UploadedFile, } from '@nestjs/common';
import { ReviewerService } from './reviewer.service';
import { CreateReviewerDto, LoginDto, UpdateProfileDto, VerifyWorkDto } from './reviewer.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { diskStorage, MulterError } from 'multer';

@Controller('reviewer')
export class ReviewerController {
  constructor(private readonly reviewerService: ReviewerService) {}
  @Get()
  getHello(): string {
    return this.reviewerService.getHello();
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file',
    { 
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/)) {
          cb(null, true);
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
    return { message: "PDF Uploaded Successfully",};
  }
  @Post('signup') //localhost:3000/reviewer/signup
  @UsePipes(new ValidationPipe())
  signup(@Body() reviewerDto:CreateReviewerDto):object {
    return this.reviewerService.signup(reviewerDto);
  }
@Post('login')  //localhost:3000/reviewer/login
login(@Body() loginDto:LoginDto):object {
    return this.reviewerService.login(loginDto);
  }

  @Get('profile/:id')  //localhost:3000/reviewer/profile/1
  getProfile(@Param('id') id: string):object {
    return this.reviewerService.getProfile(id);
  }

  @Put('profile/:id')  //localhost:3000/reviewer/profile/1
  updateProfile(
    @Param('id') id: string, 
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.reviewerService.updateProfile(id, updateProfileDto);
  }
  @Get('verify-users')    //localhost:3000/reviewer/verify-users?type=student
  getUsersToVerify(@Query('type') type: string) {
    return this.reviewerService.getUsersToVerify(type);
  }
  @Patch('verify-users/:id')  //localhost:3000/reviewer/verify-users/1
  verifyUser(@Param('id', ParseIntPipe) id: number) {
    return this.reviewerService.verifyUser(id);
  }

  @Post('/work/:workId/review')  //localhost:3000/reviewer/work/1/review
  reviewWork(
    @Param('workId', ParseIntPipe) workId: number,
    @Body() verifyWorkDto: VerifyWorkDto
  ) {
    return this.reviewerService.reviewWork(workId, verifyWorkDto);
  }

@Delete('/reports/:reportId')   //localhost:3000/reviewer/reports/1
  resolveReport(@Param('reportId', ParseIntPipe) reportId: number) {
    return this.reviewerService.resolveReport(reportId);
  }
}