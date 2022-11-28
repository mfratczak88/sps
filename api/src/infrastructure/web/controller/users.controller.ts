import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../../security/user/user.service';
import { Id } from '../../../domain/id';
import { ChangeRoleCommand } from '../../security/user/user.command';
import { Role } from '../../security/authorization/role';
import RoleGuard from '../../security/authorization/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @UseGuards(RoleGuard(Role.ADMIN))
  async getAll() {
    return this.usersService.getAll();
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async changeRole(@Param('id') id: Id, @Body() { role }: ChangeRoleCommand) {
    return this.usersService.changeRole(id, role);
  }
}
