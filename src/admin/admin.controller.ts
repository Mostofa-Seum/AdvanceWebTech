import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateEmployeeProfileDto,
  UpdateEmployeeProfileDto,
  CreateNotificationDto,
} from './admin.dto';

@Controller('admin')
@UsePipes(new ValidationPipe({ transform: true }))
export class AdminController {
  constructor(private readonly adminService: AdminService) { }


  // 3. Basic CRUD Read (GET)
  @Get('users')
  @UseGuards(AuthGuard)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // 4. Relational CRUD Create 1:1 (POST)
  @Post('users/:userId/employee')
  @UseGuards(AuthGuard)
  async createEmployeeProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateEmployeeProfileDto,
  ) {
    return this.adminService.createEmployeeProfile(userId, dto);
  }

  // 5. Relational CRUD Update 1:1 (PUT)
  @Put('users/:userId/employee/:employeeId')
  @UseGuards(AuthGuard)
  async updateEmployeeProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Body() dto: UpdateEmployeeProfileDto,
  ) {
    return this.adminService.updateEmployeeProfile(userId, employeeId, dto);
  }

  // 6. Relational CRUD Create 1:N (POST)
  @Post('users/:userId/notifications')
  @UseGuards(AuthGuard)
  async createNotification(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.adminService.createNotification(userId, dto);
  }

  // 7. Basic CRUD Delete (DELETE)
  @Delete('users/:userId')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.adminService.deleteUser(userId);
  }
}
