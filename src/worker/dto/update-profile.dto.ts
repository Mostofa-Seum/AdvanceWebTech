import { IsString, IsNotEmpty, Matches, IsDateString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  //Name field should not contain any numbers
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\d]*$/, { message: 'Name should not contain any numbers' }) 
  name: string;

  //Password must contain one special character (@ or # or $ or &)
  @IsNotEmpty()
  @Matches(/[@#\$&]/, { message: 'Password must contain @, #, $, or &' })
  password: string;

  //Validate a Date given is valid date type
  @IsDateString({}, { message: 'Please provide a valid date' })
  dob: string;

  //Validate Social media links (URL format)
  @IsUrl({}, { message: 'Please provide a valid social media URL' })
  socialMediaLink: string;
}