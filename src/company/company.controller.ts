import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanySignupDTO } from './company.dto';
import { CompanyLoginDTO } from './company.dto';
import { PostJobDTO } from './company.dto';
import { EditJobDTO } from './company.dto';
import { ReviewEmployeeDTO } from './company.dto';
import { MakePaymentDTO } from './company.dto';
import { EditProfileDTO } from './company.dto';
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
  signupCompany(@Body() myobj: CompanySignupDTO): object {
    console.log(myobj.companyName);
    return this.companyService.signupCompany(myobj);
  }

  
  @Post('job')
  postJob(@Body() myobj: PostJobDTO): object {
    console.log(myobj.companyName);
    return this.companyService.postJob(myobj);
  }

  
  @Delete('job/remove/:jobId')
  removeJob(
    @Param('jobId') jobId: number,
    @Query('companyName') companyName: string
  ): object {
    console.log(jobId);
    return this.companyService.removeJob(companyName, jobId);
  }

  
  @Put('job/edit/:jobId')
  editJob(
    @Param('jobId') jobId: number,
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