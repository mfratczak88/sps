import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../security/user/user.service';
import { Id } from '../../application/id';
import { ChangeRoleCommand } from '../security/user/user.command';
import { Role } from '../security/authorization/role';
import RoleGuard from '../security/authorization/role.guard';
import { CsrfGuard } from '../security/csrf/csrf.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(RoleGuard(Role.ADMIN))
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(CsrfGuard, RoleGuard(Role.ADMIN))
  @Patch(':id')
  async changeRole(@Param('id') id: Id, @Body() { role }: ChangeRoleCommand) {
    return this.usersService.changeRole(id, role);
  }
}
