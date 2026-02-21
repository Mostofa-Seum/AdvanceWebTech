import { Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, UseInterceptors , 
  UploadedFile, UsePipes, ValidationPipe, Res} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanySignupDTO } from './company.dto';
import { CompanyLoginDTO } from './company.dto';
import { PostJobDTO } from './company.dto';
import { EditJobDTO } from './company.dto';
import { ReviewEmployeeDTO } from './company.dto';
import { MakePaymentDTO } from './company.dto';
import { EditProfileDTO } from './company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError , diskStorage } from 'multer'


@Controller('company')
export class CompanyController {

  constructor(private companyService: CompanyService) {}

  
  @Get()
    getHello(): string {
    return this.companyService.getHello();
  }


  @Post('login')
  loginCompany(@Body() myobj: CompanyLoginDTO): object {
    console.log(myobj.email);
    return this.companyService.loginCompany(myobj);
  }

  
  @Post('signup')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
  FileInterceptor('nidImg', {
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
): object {
  console.log(myobj.companyName);
  console.log(myobj.email);
  console.log(myobj.nid);
  console.log(file?.filename);

  return this.companyService.signupCompany(myobj, file);
}

  @Get('getimage/:name')
  getImages(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './uploads' })
}
// http://localhost:3000/company/getimage/1771574554581_NID.png

  @Post('job')
  postJob(@Body() myobj: PostJobDTO): object {
    console.log(myobj.companyName);
    return this.companyService.postJob(myobj);
  }

  
  @Delete('job/remove/:jobId')
  removeJob(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('companyName') companyName: string
  ): object {
    console.log(jobId);
    return this.companyService.removeJob(companyName, jobId);
  }

  
  @Put('job/edit/:jobId')
  editJob(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('companyName') companyName: string,
    @Query('email') email: string,
    @Body() myobj: EditJobDTO
  ): object {
    console.log(jobId);
    return this.companyService.editJob(companyName, email, jobId, myobj);
  }

  
  @Post('review/employee')
  reviewEmployee(@Body() myobj: ReviewEmployeeDTO): object {
    console.log(myobj.employeeId);
    return this.companyService.reviewEmployee(myobj);
  }

  
  @Post('payment')
  makePayment(@Body() myobj: MakePaymentDTO): object {
    console.log(myobj.jobId);
    return this.companyService.makePayment(myobj);
  }

  
  @Put('profile/edit')
  editProfile(@Body() myobj: EditProfileDTO): object {
    console.log(myobj.companyName);
    return this.companyService.editProfile(myobj);
  }

  
  @Get('job/search')
  getJob(
    @Query('companyName') companyName: string,
    @Query('email') email: string
  ): object {
    return this.companyService.getJob(companyName, email);
  }


}