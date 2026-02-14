import { Module } from '@nestjs/common';
import { ReviewerModule } from './reviewer/reviewer.module';

@Module({
  imports: [ReviewerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
