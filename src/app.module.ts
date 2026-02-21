import { Module } from '@nestjs/common';
import { ReviewerModule } from './reviewer/reviewer.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [ReviewerModule, WorkerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
