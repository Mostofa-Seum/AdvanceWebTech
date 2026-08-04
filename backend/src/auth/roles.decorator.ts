import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../reviewer/user.entity';

/**
 * Attach allowed roles to a route. Used together with RolesGuard.
 * Example: @Roles(UserRole.COMPANY)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
