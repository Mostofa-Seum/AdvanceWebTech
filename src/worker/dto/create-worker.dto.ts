// export class CreateWorkerDto {
//   name: string;
//   email: string;
//   skills: string[];
// }

import { IsString, IsNotEmpty, Matches, IsDateString, IsUrl, NotContains, IsAlpha } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'Name should not contain any numbers' }) 
  name: string;

  @IsNotEmpty()
  @Matches(/[@#\$&]/, { message: 'Password must contain @ or # or $ or &' }) 
  @IsString()
  password: string;

  @IsDateString({}, { message: 'Please provide a valid date' }) 
  dob: string;

  @IsUrl({}, { message: 'Please provide a valid social media URL' }) 
  socialMediaLink: string;
}