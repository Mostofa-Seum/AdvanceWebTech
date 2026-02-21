import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Controller('worker')
export class WorkerController {

  // 1. Signup
  @Post('signup')
  signup(@Body() data: CreateWorkerDto) {
    return { message: "Account created", data };
  }

  // 2. Verify Account
  @Get('verify/:id')
  verify(@Param('id') id: string) {
    return { status: "Verified", userId: id };
  }

  // 3. Search Job
  @Get('search-job')
  searchJob(@Query('category') category: string) {
    return { results: `Showing jobs for ${category}` };
  }

  // 4. Accept Job
  @Patch('accept-job/:jobId')
  acceptJob(@Param('jobId') jobId: string) {
    return { message: `Job ${jobId} accepted` };
  }

  // 5. Edit Profile
  @Put('edit-profile')
  editProfile(@Body() updateData: any) {
    return { message: "Profile updated", updateData };
  }

  // 6. Review Company
  @Post('review-company')
  reviewCompany(@Body() review: any) {
    return { status: "Review submitted" };
  }

  // 7. Apply for Reviewer
  @Post('apply-reviewer')
  applyReviewer() {
    return { message: "Application received" };
  }

  // 8. Accept Payment (DELETE example or POST)
  @Delete('delete-account/:id')
  deleteAccount(@Param('id') id: string) {
    return { message: `User ${id} deleted` };
  }
}