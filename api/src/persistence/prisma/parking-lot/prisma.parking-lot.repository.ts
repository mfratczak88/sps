import { ParkingLotRepository } from '../../../domain/parking-lot/parking-lot.repository';
import { PrismaService } from '../prisma.service';
import { ParkingLot } from '../../../domain/parking-lot/parking-lot';
import { Id } from '../../../domain/id';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';
import { Address } from '../../../domain/parking-lot/address';
import { Injectable } from '@nestjs/common';
import { OperationTime } from '../../../domain/parking-lot/operation-time';

@Injectable()
export class PrismaParkingLotRepository implements ParkingLotRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByIdOrElseThrow(id: Id): Promise<ParkingLot> {
    const prismaParkingLot = await this.prismaService.parkingLot.findFirst({
      where: {
        id,
      },
    });
    if (!prismaParkingLot) {
      throw new DomainException({
        message: MessageCode.PARKING_LOT_DOES_NOT_EXIST,
      });
    }
    const { city, capacity, operationTimeRule, streetName, streetNumber } =
      prismaParkingLot;
    return new ParkingLot(
      id,
      new Address(city, streetName, streetNumber),
      capacity,
      OperationTime.fromRRule(operationTimeRule),
    );
  }

  async save(lot: ParkingLot): Promise<void> {
    const {
      id,
      city,
      streetName,
      streetNumber,
      timeOfOperation: { rrule },
      capacity,
    } = lot.plain();
    const upsertFields = {
      streetNumber,
      streetName,
      city,
      capacity,
      operationTimeRule: rrule,
    };
    await this.prismaService.parkingLot.upsert({
      where: {
        id,
      },
      update: {
        ...upsertFields,
      },
      create: {
        id,
        ...upsertFields,
      },
    });
  }
}
