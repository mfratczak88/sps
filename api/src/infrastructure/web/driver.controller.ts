import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { DriverService } from '../../application/driver/driver.service';
import { Id } from '../../domain/id';
import {
  AddVehicleCommand,
  AssignParkingLotCommand,
} from '../../application/driver/driver.command';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

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
