const fs = require('fs');
const path = 'f:/Coding/Adv web/AdvanceWebTech/backend/src/admin/admin.controller.ts';
let content = fs.readFileSync(path, 'utf8');

// Ensure imports
if (!content.includes('UseGuards')) {
    content = content.replace(/import \{ Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseUUIDPipe, UsePipes, ValidationPipe \} from '@nestjs\/common';/, 
        "import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseUUIDPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';\nimport { AuthGuard } from '../auth/auth.guard';");
} else if (!content.includes('AuthGuard')) {
    content = content.replace(/import \{ AdminService \} from '.\/admin.service';/,
        "import { AdminService } from './admin.service';\nimport { AuthGuard } from '../auth/auth.guard';");
}

// Add UseGuards
content = content.replace(/@(Get|Put|Patch|Delete)\((.*?)\)/g, '@UseGuards(AuthGuard)\n  @$1($2)');

// Exclude login and signup just to be safe, though they are Post
fs.writeFileSync(path, content);
console.log('Done');
