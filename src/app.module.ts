import { Module } from '@nestjs/common';
import { ReviewerModule } from './reviewer/reviewer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ReviewerModule, TypeOrmModule.forRoot(
{ type: 'postgres',
host: 'localhost',
port: 5432,
username: 'postgres',
password: 'root',
database: 'secc',  
autoLoadEntities: true,
synchronize: true,
} ), AuthModule,
],controllers: [],
  providers: [],
})
export class AppModule {}
