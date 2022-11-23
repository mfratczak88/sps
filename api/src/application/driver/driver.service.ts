import { Injectable } from '@nestjs/common';
import { DriverRepository } from '../../domain/driver/driver.repository';
import {
  AddVehicleCommand,
  AssignParkingLotCommand,
  RemoveParkingLotAssignmentCommand,
} from './driver.command';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  async addVehicle(command: AddVehicleCommand): Promise<void> {
    const { licensePlate, driverId } = command;
    const driver = await this.driverRepository.findByIdOrThrow(driverId);
    driver.addVehicle(licensePlate);
    await this.driverRepository.save(driver);
  }

  async assignParkingLot(command: AssignParkingLotCommand): Promise<void> {
    const { parkingLotId, driverId } = command;
    const driver = await this.driverRepository.findByIdOrThrow(driverId);
    driver.assignParkingLot(parkingLotId);
    await this.driverRepository.save(driver);
  }

  async removeParkingLotAssignment(command: RemoveParkingLotAssignmentCommand) {
    const { parkingLotId, driverId } = command;
    const driver = await this.driverRepository.findByIdOrThrow(driverId);
    driver.removeLotAssignment(parkingLotId);
    await this.driverRepository.save(driver);
  }
}
