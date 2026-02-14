import { Module } from '@nestjs/common';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';

@Module({
  imports: [],
  controllers: [ReviewerController],
  providers: [ReviewerService],
})
export class ReviewerModule {}
