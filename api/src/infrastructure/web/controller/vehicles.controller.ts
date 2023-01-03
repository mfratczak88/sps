import { Controller, Get, UseGuards } from '@nestjs/common';
import { DriverFinder } from '../../../application/driver/driver.finder';
import RoleGuard from '../../security/authorization/role.guard';
import { Role } from '../../security/authorization/role';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly finder: DriverFinder) {}

  @Get()
  @UseGuards(RoleGuard(Role.CLERK))
  findAll() {
    return this.finder.findAllVehicles();
  }
}
