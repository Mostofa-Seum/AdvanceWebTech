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
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../reviewer/user.entity';
import { EmployeeService } from './employee.service';
import {
  UpdateProfileDto,
  ApplyDto,
  SubmitWorkDto,
  RateDto,
  CreateReportDto,
  ChangePasswordDto,
} from './employee.dto';

@Controller('employee')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.EMPLOYEE)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // ─── PROFILE ─────────────────────────────────────────────────────────
  @Get('profile/:id')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeService.getProfile(id);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.employeeService.updateProfile(id, dto);
  }

  @Patch('profile/:id/change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.employeeService.changePassword(id, dto);
  }

  // ─── BROWSE / APPLY ──────────────────────────────────────────────────
  @Get('jobs')
  async browseJobs(
    @Query('employeeId') employeeId: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.employeeService.browseJobs(employeeId, category, search);
  }

  @Get('jobs/:id')
  async getJob(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.employeeService.getJob(employeeId, id);
  }

  @Post('jobs/:id/apply')
  @UsePipes(new ValidationPipe())
  async apply(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApplyDto,
  ) {
    return this.employeeService.apply(employeeId, id, dto);
  }

  // ─── APPLICATIONS ────────────────────────────────────────────────────
  @Get('applications')
  async listApplications(@Query('employeeId') employeeId: string) {
    return this.employeeService.listMyApplications(employeeId);
  }

  @Delete('applications/:id')
  async withdrawApplication(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.employeeService.withdrawApplication(employeeId, id);
  }

  // ─── ASSIGNED / SUBMIT WORK ──────────────────────────────────────────
  @Get('assigned')
  async listAssigned(@Query('employeeId') employeeId: string) {
    return this.employeeService.listAssigned(employeeId);
  }

  @Get('assigned/:id')
  async getAssigned(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.employeeService.getAssigned(employeeId, id);
  }

  @Post('assigned/:id/submit')
  @UsePipes(new ValidationPipe())
  async submitWork(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitWorkDto,
  ) {
    return this.employeeService.submitWork(employeeId, id, dto);
  }

  @Get('submissions')
  async listSubmissions(@Query('employeeId') employeeId: string) {
    return this.employeeService.listMySubmissions(employeeId);
  }

  // ─── EARNINGS ────────────────────────────────────────────────────────
  @Get('payments')
  async listEarnings(@Query('employeeId') employeeId: string) {
    return this.employeeService.listEarnings(employeeId);
  }

  // ─── RATING ──────────────────────────────────────────────────────────
  @Post('jobs/:id/rate')
  @UsePipes(new ValidationPipe())
  async rateCompany(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RateDto,
  ) {
    return this.employeeService.rateCompany(employeeId, id, dto);
  }

  // ─── REPORTS ─────────────────────────────────────────────────────────
  @Post('reports')
  @UsePipes(new ValidationPipe())
  async createReport(
    @Query('employeeId') employeeId: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.employeeService.createReport(employeeId, dto);
  }

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────
  @Get('notifications')
  async listNotifications(@Query('employeeId') employeeId: string) {
    return this.employeeService.listNotifications(employeeId);
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(
    @Query('employeeId') employeeId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.employeeService.markNotificationRead(employeeId, id);
  }

  @Patch('notifications/read-all')
  async markAllNotificationsRead(@Query('employeeId') employeeId: string) {
    return this.employeeService.markAllNotificationsRead(employeeId);
  }
}
