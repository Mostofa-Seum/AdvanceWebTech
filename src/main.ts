import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();


//Postman Testing - No Error(201)
// {
//   "name": "Helal Uddin",
//   "password": "pass@word",
//   "dob": "2000-01-01",
//   "socialMediaLink": "https://linkedin.com/in/helal"
// }


//Postman Testing -Error (400)
// {
//   "name": "Helal123", 
//   "password": "mypassword",
//   "dob": "not-a-date",
//   "socialMediaLink": "facebook"
// }
