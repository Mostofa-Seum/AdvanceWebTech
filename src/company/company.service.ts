import { Injectable } from '@nestjs/common';
import { CompanySignupDTO } from './company.dto';

@Injectable()
export class CompanyService {

  
  getHello(): string {
    return "Hello World!";
  }


  loginCompany(myobj: object): object {
    console.log(myobj);
    return { message: "company login", myobj };
  }

  
  signupCompany(myobj: CompanySignupDTO, file?: Express.Multer.File): object {
  console.log(myobj);
  console.log(file);

  return {
    message: 'company signup',
    data: myobj,
    nidImg: file ? file.filename : null,
  };
}

  postJob(myobj: object): object {
    console.log(myobj);
    return { message: "job posted", myobj };
  }

  removeJob(companyName: string, jobId: number): object {
    console.log(companyName);
    console.log(jobId);
    return {
      message: "job removed",
      companyName: companyName,
      jobId: jobId
    };
  }

  editJob(companyName: string, email: string, jobId: number, myobj: object): object {
    console.log(companyName);
    console.log(email);
    console.log(jobId);
    console.log(myobj);

    return {
      message: "job edited",
      companyName: companyName,
      email: email,
      jobId: jobId,
      myobj
    };
  }

  reviewEmployee(myobj: object): object {
    console.log(myobj);

    return {
      message: "employee reviewed successfully",
      myobj
    };
  }

  makePayment(myobj: object): object {
    console.log(myobj);

    return {
      message: "payment successful",
      myobj
    };
  }

  editProfile(myobj: object): object {
    console.log(myobj);

    return {
      message: "profile is updated",
      myobj
    };
  }

  getJob(companyName: string, email: string): object {
    console.log(companyName);
    console.log(email);

    return {
      companyName: companyName,
      email: email,
      message: "job data"
    };
  }

}
