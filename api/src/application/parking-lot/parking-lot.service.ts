import { Injectable } from '@nestjs/common';
import { Id, IdGenerator } from '../../domain/id';
import { ParkingLotRepository } from '../../domain/parking-lot/parking-lot.repository';
import {
  ChangeCapacityCommand,
  ChangeHoursOfOperationCommand,
  CreateParkingLotCommand,
} from './parking-lot.command';
import { ParkingLot } from '../../domain/parking-lot/parking-lot';
import { Address } from '../../domain/parking-lot/address';
import { OperationTime } from '../../domain/parking-lot/operation-time';

@Injectable()
export class ParkingLotService {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly parkingLotRepository: ParkingLotRepository,
  ) {}

  async createNewLot(command: CreateParkingLotCommand): Promise<{ id: Id }> {
    const id = await this.idGenerator.generate();
    const {
      address: { streetName, streetNumber, city },
      hoursOfOperation: { hourTo, hourFrom, validFrom, days },
      capacity,
    } = command;
    const lot = new ParkingLot(
      id,
      new Address(city, streetName, streetNumber),
      capacity,
      new OperationTime(hourFrom, hourTo, days, validFrom),
    );
    await this.parkingLotRepository.save(lot);
    return { id };
  }

  async changeHoursOfOperation(command: ChangeHoursOfOperationCommand) {
    const { parkingLotId, hourTo, hourFrom } = command;
    const parkingLot = await this.parkingLotRepository.findByIdOrElseThrow(
      parkingLotId,
    );
    parkingLot.changeOperationHours({ hourFrom, hourTo });
    await this.parkingLotRepository.save(parkingLot);
  }
  async changeCapacity(command: ChangeCapacityCommand) {
    const { parkingLotId, capacity } = command;
    const parkingLot = await this.parkingLotRepository.findByIdOrElseThrow(
      parkingLotId,
    );
    parkingLot.changeCapacity(capacity);
    await this.parkingLotRepository.save(parkingLot);
  }
}
