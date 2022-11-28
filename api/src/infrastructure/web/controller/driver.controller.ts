import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from '../../../application/driver/driver.service';
import { Id } from '../../../domain/id';
import {
  AddVehicleCommand,
  AssignParkingLotCommand,
} from '../../../application/driver/driver.command';
import RoleGuard from '../../security/authorization/role.guard';
import { Role } from '../../security/authorization/role';
import { CsrfGuard } from '../../security/csrf/csrf.guard';
import { JwtAuthGuard } from '../../security/authorization/jwt-auth.guard';
import { DriverFinder } from '../../../application/driver/driver.finder';
import { PoliciesGuard } from '../../security/authorization/policy/policies.guard';
import { CheckPolicies } from '../../security/authorization/policy/check-policies.decorator';
import { CanAddVehicle } from '../../security/authorization/policy/driver.policy';

@Controller('drivers')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly finder: DriverFinder,
  ) {}

  @Get()
  @UseGuards(RoleGuard(Role.ADMIN))
  getAllDrivers() {
    return this.finder.findAll();
  }

  @Post(':driverId/vehicles')
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
  @CheckPolicies(new CanAddVehicle())
  addVehicle(
    @Param('driverId') driverId: Id,
    @Body() command: AddVehicleCommand,
  ) {
    return this.driverService.addVehicle({
      ...command,
      driverId,
    });
  }

  @Post(':driverId/parkingLots')
  @UseGuards(RoleGuard(Role.ADMIN), CsrfGuard)
  addParkingLot(
    @Param('driverId') driverId: Id,
    @Body() command: AssignParkingLotCommand,
  ) {
    return this.driverService.assignParkingLot({
      ...command,
      driverId,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN), CsrfGuard)
  @HttpCode(202)
  @Delete(':driverId/parkingLots/:parkingLotId')
  removeParkingLotAssignment(
    @Param('driverId') driverId: Id,
    @Param('parkingLotId') parkingLotId: Id,
  ) {
    return this.driverService.removeParkingLotAssignment({
      driverId,
      parkingLotId,
    });
  }
}
