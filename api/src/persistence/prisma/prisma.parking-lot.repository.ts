import { ParkingLotRepository } from '../../domain/parking-lot.repository';
import { PrismaService } from './prisma.service';
import { ParkingLot } from '../../domain/parking-lot';
import { Id } from '../../domain/id';
import { DomainException } from '../../domain/domain.exception';
import { MessageCode } from '../../message';
import { Address } from '../../domain/address';
import { Injectable } from '@nestjs/common';

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
    const { city, capacity, hourFrom, hourTo, streetName, streetNumber } =
      prismaParkingLot;
    return new ParkingLot(
      id,
      new Address(city, streetName, streetNumber),
      capacity,
      { hourFrom, hourTo },
    );
  }

  async save(lot: ParkingLot): Promise<void> {
    const {
      id,
      capacity,
      address: { streetName, streetNumber, city },
      hoursOfOperation: { hourTo, hourFrom },
    } = lot;

    const upsertFields = {
      hourTo,
      hourFrom,
      streetNumber,
      streetName,
      city,
      capacity,
    };
    await this.prismaService.parkingLot.upsert({
      where: {
        id: lot.id,
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
