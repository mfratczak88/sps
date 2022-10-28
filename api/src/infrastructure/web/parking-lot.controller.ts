import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParkingLotService } from '../../application/parking-lot/parking-lot.service';
import {
  ChangeCapacityCommand,
  ChangeHoursOfOperationCommand,
  CreateParkingLotCommand,
} from '../../application/parking-lot/parking-lot.command';
import { Id } from '../../domain/id';
import { CsrfGuard } from '../security/csrf/csrf.guard';
import RoleGuard from '../security/authorization/role.guard';
import { Role } from '../security/authorization/role';
import { ParkingLotFinder } from '../../application/parking-lot/parking-lot.finder';

@Controller('parking-lots')
export class ParkingLotController {
  constructor(
    private readonly parkingLotService: ParkingLotService,
    private readonly finder: ParkingLotFinder,
  ) {}

  @UseGuards(RoleGuard(Role.ADMIN), CsrfGuard)
  @Post()
  createParkingLot(@Body() command: CreateParkingLotCommand) {
    return this.parkingLotService.createNewLot(command);
  }

  @UseGuards(RoleGuard(Role.ADMIN), CsrfGuard)
  @HttpCode(204)
  @Patch(':parkingLotId/hoursOfOperation')
  changeHoursOfOperation(
    @Param('parkingLotId') parkingLotId: Id,
    @Body() command: ChangeHoursOfOperationCommand,
  ) {
    return this.parkingLotService.changeHoursOfOperation({
      ...command,
      parkingLotId,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN), CsrfGuard)
  @HttpCode(204)
  @Patch(':parkingLotId/capacity')
  changeCapacity(
    @Param('parkingLotId') parkingLotId: Id,
    @Body() command: ChangeCapacityCommand,
  ) {
    return this.parkingLotService.changeCapacity({
      ...command,
      parkingLotId,
    });
  }
  @UseGuards(RoleGuard(Role.ADMIN))
  @Get()
  findAll() {
    return this.finder.findAll();
  }
}
