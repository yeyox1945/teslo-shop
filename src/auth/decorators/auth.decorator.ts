import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        // SetMetadata('roles', roles),
        RoleProtected(...roles), // Set the valid roles for the UserRoleGuard
        UseGuards(AuthGuard(), UserRoleGuard),
    );
}