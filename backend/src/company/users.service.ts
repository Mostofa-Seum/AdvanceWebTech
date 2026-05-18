// users.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import {
  UserEntity,
} from './user.entity';

import {
  CompanyEntity,
} from './company.entity';

@Injectable()
export class UsersService {

  constructor(

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,

  ) { }

  async findOneByEmail(
    email: string,
  ): Promise<UserEntity | null> {

    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getCompanyProfile(
    companyName: string,
  ): Promise<CompanyEntity> {

    const company =
      await this.companyRepository.findOne({

        where: {
          companyName,
        },

        relations: {
          jobs: true,
        },
      });

    if (!company) {

      throw new NotFoundException(
        'Company profile not found',
      );
    }

    return company;
  }
}