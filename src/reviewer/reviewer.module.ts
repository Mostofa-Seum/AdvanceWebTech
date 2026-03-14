import { Module } from '@nestjs/common';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';
import { Reviewer } from './reviewer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reviewer])], // Add your entities here
  controllers: [ReviewerController],
  providers: [ReviewerService],
})
export class ReviewerModule {}
