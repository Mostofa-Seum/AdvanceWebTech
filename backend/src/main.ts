import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // This allows the frontend to connect to the backend without CORS network errors!
  await app.listen(3000);
}
bootstrap();
