import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 👈 Import this

const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔌 1. Enable CORS so your Next.js app (port 5000) can talk to it
  app.enableCors({
    origin: 'http://localhost:5000', 
    credentials: true, // Crucial because you are using cookies!
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // 🛡️ 2. Enable Global Validation Pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();