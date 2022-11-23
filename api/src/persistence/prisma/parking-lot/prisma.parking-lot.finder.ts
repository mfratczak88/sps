import { Injectable } from '@nestjs/common';
import { ParkingLotFinder } from '../../../application/parking-lot/parking-lot.finder';
import { ParkingLotReadModel } from '../../../application/parking-lot/parking-lot.read-model';
import { PrismaService } from '../prisma.service';
import { RRule } from 'rrule';

@Injectable()
export class PrismaParkingLotFinder implements ParkingLotFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ParkingLotReadModel[]> {
    const parkingLots = await this.prismaService.parkingLot.findMany();
    return parkingLots.map((lot) => PrismaParkingLotFinder.prismaLotToDto(lot));
  }

  static prismaLotToDto(prismaLot) {
    const {
      id,
      city,
      streetName,
      streetNumber,
      createdAt,
      capacity,
      operationTimeRule,
    } = prismaLot;
    const rrule = RRule.fromString(operationTimeRule);
    const {
      options: { byhour, byweekday: days, dtstart: startFromDate },
    } = rrule;
    return {
      id,
      city,
      streetName,
      streetNumber,
      capacity,
      createdAt,
      days,
      hourTo: byhour[byhour.length - 1] + 1,
      hourFrom: byhour[0],
      validFrom: startFromDate,
    };
  }
}
