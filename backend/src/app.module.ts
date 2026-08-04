import { Module } from '@nestjs/common';
import { ReviewerModule } from './reviewer/reviewer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { PusherModule } from './pusher/pusher.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PublicModule } from './public/public.module';
import { CompanyModule } from './company/company.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ReviewerModule,
    AdminModule,
    PusherModule,
    NotificationsModule,
    PublicModule,
    CompanyModule,
    EmployeeModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbUrl = process.env.DATABASE_URL;
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
          };
        }
        return {
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432', 10),
          username: process.env.DATABASE_USER || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'admin',
          database: process.env.DATABASE_NAME || 'secd',
          autoLoadEntities: true,
          synchronize: true,
          ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
