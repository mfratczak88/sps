import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from '../../application/driver/driver.service';
import { Id } from '../../domain/id';
import {
  AddVehicleCommand,
  AssignParkingLotCommand,
} from '../../application/driver/driver.command';
import RoleGuard from '../security/authorization/role.guard';
import { Role } from '../security/authorization/role';
import { CsrfGuard } from '../security/csrf/csrf.guard';
import { JwtAuthGuard } from '../security/authorization/jwt-auth.guard';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @Post(':driverId/vehicles')
  addVehicle(
    @Param('driverId') driverId: Id,
    @Body() command: AddVehicleCommand,
  ) {
    return this.driverService.addVehicle({
      ...command,
      driverId,
    });
  }
  @UseGuards(RoleGuard(Role.ADMIN), CsrfGuard)
  @Post(':driverId/parkingLots')
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
