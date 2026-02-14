import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {

  
  getHello(): string {
    return "Hello World!";
  }


  loginCompany(myobj: object): object {
    console.log(myobj);
    return { message: "company login", myobj };
  }

  signupCompany(myobj: object): object {
    console.log(myobj);
    return { message: "company signup", myobj };
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
