// export class CreateWorkerDto {
//   name: string;
//   email: string;
//   skills: string[];
// }

import { IsString, IsNotEmpty, Matches, IsDateString, IsUrl, NotContains, IsAlpha } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]*$/, { message: 'Name should not contain any numbers' }) // Rule: No numbers [cite: 29]
  name: string;

  @IsNotEmpty()
  @Matches(/[@#\$&]/, { message: 'Password must contain @ or # or $ or &' }) // Rule: Special char [cite: 30]
  @IsString()
  password: string;

  @IsDateString({}, { message: 'Please provide a valid date' }) // Rule: Valid date type [cite: 31]
  dob: string;

  @IsUrl({}, { message: 'Please provide a valid social media URL' }) // Rule: URL format [cite: 32]
  socialMediaLink: string;
}