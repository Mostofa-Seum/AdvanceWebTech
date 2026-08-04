import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { PublicService } from './public.service';

/**
 * Public (no-auth) endpoints that power the marketing pages:
 *   /projects  -> GET /jobs
 *   /talent    -> GET /talent
 */
@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('jobs')
  async listJobs(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.publicService.listJobs(category, search);
  }

  @Get('jobs/categories')
  async listCategories() {
    return this.publicService.listCategories();
  }

  @Get('jobs/:id')
  async getJob(@Param('id', ParseUUIDPipe) id: string) {
    return this.publicService.getJob(id);
  }

  @Get('talent')
  async listTalent() {
    return this.publicService.listTalent();
  }
}
