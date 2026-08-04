import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../reviewer/user.entity';
import { CompanyService } from './company.service';
import {
  CreateJobDto,
  UpdateJobDto,
  RateDto,
  CreateReportDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './company.dto';
import { Request } from 'express';

@Controller('company')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.COMPANY)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Convenience helper: company endpoints take companyId in the URL, but
  // we resolve the caller from the JWT and look up their company.
  private async resolveCompanyId(req: Request): Promise<string> {
    // The frontend already knows its companyId (from login payload), so it
    // passes it explicitly in the URL. This helper is unused but kept for
    // future self-resolving endpoints.
    return (req as any).user?.sub;
  }

  // ─── PROFILE ─────────────────────────────────────────────────────────
  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.getProfile(id);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.companyService.updateProfile(id, dto);
  }

  @Patch('profile/:id/change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.companyService.changePassword(id, dto);
  }

  // ─── JOBS ────────────────────────────────────────────────────────────
  @Post('jobs')
  @UsePipes(new ValidationPipe())
  async createJob(
    @Param() _p: any, // no params, kept for consistent signature
    @Body() dto: CreateJobDto,
    @Query('companyId') companyId: string,
  ) {
    return this.companyService.createJob(companyId, dto);
  }

  @Get('jobs')
  async listJobs(@Query('companyId') companyId: string) {
    return this.companyService.listMyJobs(companyId);
  }

  @Get('jobs/:id')
  async getJob(@Query('companyId') companyId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.getMyJob(companyId, id);
  }

  @Put('jobs/:id')
  async updateJob(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.companyService.updateJob(companyId, id, dto);
  }

  @Delete('jobs/:id')
  async deleteJob(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.companyService.deleteJob(companyId, id);
  }

  @Get('jobs/:id/applications')
  async listJobApplications(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.companyService.listJobApplications(companyId, id);
  }

  @Patch('applications/:id/accept')
  async acceptApplication(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.companyService.acceptApplication(companyId, id);
  }

  @Patch('applications/:id/reject')
  async rejectApplication(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.companyService.rejectApplication(companyId, id);
  }

  // ─── PAYMENTS ────────────────────────────────────────────────────────
  @Get('payments')
  async listPayments(@Query('companyId') companyId: string) {
    return this.companyService.listMyPayments(companyId);
  }

  @Patch('payments/:id/release')
  async releasePayment(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.companyService.releasePayment(companyId, id);
  }

  // ─── RATING ──────────────────────────────────────────────────────────
  @Post('jobs/:id/rate')
  @UsePipes(new ValidationPipe())
  async rateEmployee(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RateDto,
  ) {
    return this.companyService.rateEmployee(companyId, id, dto);
  }

  // ─── REPORTS ─────────────────────────────────────────────────────────
  @Post('reports')
  @UsePipes(new ValidationPipe())
  async createReport(
    @Query('companyId') companyId: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.companyService.createReport(companyId, dto);
  }

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────
  @Get('notifications')
  async listNotifications(@Query('companyId') companyId: string) {
    return this.companyService.listNotifications(companyId);
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(
    @Query('companyId') companyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.companyService.markNotificationRead(companyId, id);
  }

  @Patch('notifications/read-all')
  async markAllNotificationsRead(@Query('companyId') companyId: string) {
    return this.companyService.markAllNotificationsRead(companyId);
  }
}
