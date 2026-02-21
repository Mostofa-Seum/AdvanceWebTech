import {
  Controller, Get, Post, Put, Patch, Body, Param, ParseIntPipe, Query, UsePipes, ValidationPipe,
  UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator // <-- Ensure these are imported
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer'; // <-- NEW IMPORT
import { extname } from 'path';       // <-- NEW IMPORT

import { AdminService } from './admin.service';
import {
  AdminLoginDto, CreateCompanyDto, UpdateCompanyDto, CreateEmployeeDto, UpdateReviewerDto, ProcessReportDto, OptionalFileUploadDto
} from './admin.dto';

@Controller('admin')
@UsePipes(new ValidationPipe())
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ... (Keep all your other routes exactly the same: login, createCompany, etc.)

  // REPLACED: Physical file upload with disk storage
  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file',
    { 
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
        }
      },

      limits: { fileSize: 5242880 }, 
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname)
        },
      })
    }
  ))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: "PDF Uploaded Successfully", fileDetails: file };
  }
}