import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { EmployeeEntity } from './employee.entity';
import { NotificationEntity } from './notification.entity';
import {
  CreateEmployeeProfileDto,
  UpdateEmployeeProfileDto,
  CreateNotificationDto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // 3. Basic CRUD Read (GET)
  async getAllUsers() {
    return await this.userRepository.find({
      relations: ['employee', 'notifications'],
    });
  }

  // 4. Relational CRUD Create 1:1 (POST)
  async createEmployeeProfile(userId: string, dto: CreateEmployeeProfileDto) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    const employee = this.employeeRepository.create({
      skills: dto.skills,
      experience: dto.experience,
      portfolio: dto.portfolio,
      user: user,
    });
    return await this.employeeRepository.save(employee);
  }

  // 5. Relational CRUD Update 1:1 (PUT)
  async updateEmployeeProfile(userId: string, employeeId: string, dto: UpdateEmployeeProfileDto) {
    const employee = await this.employeeRepository.findOne({ where: { employeeId, user: { userId } } });
    if (!employee) throw new NotFoundException('Employee profile not found for this user');

    if (dto.skills) employee.skills = dto.skills;
    if (dto.experience) employee.experience = dto.experience;
    if (dto.portfolio) employee.portfolio = dto.portfolio;
    return await this.employeeRepository.save(employee);
  }

  // 6. Relational CRUD Create 1:N (POST)
  async createNotification(userId: string, dto: CreateNotificationDto) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    const notification = this.notificationRepository.create({
      title: dto.title,
      message: dto.message,
      user: user,
    });
    return await this.notificationRepository.save(notification);
  }

  // 7. Basic CRUD Delete (DELETE)
  async deleteUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.remove(user);
    return { message: 'User and cascade relations deleted successfully' };
  }
}