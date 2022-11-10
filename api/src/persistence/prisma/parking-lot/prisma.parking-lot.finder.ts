import { Injectable } from '@nestjs/common';
import { ParkingLotFinder } from '../../../application/parking-lot/parking-lot.finder';
import { PrismaService } from '../prisma.service';
import { ParkingLotReadModel } from '../../../application/parking-lot/parking-lot.read-model';

@Injectable()
export class PrismaParkingLotFinder implements ParkingLotFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ParkingLotReadModel[]> {
    return (await this.prismaService.parkingLot.findMany({})).map((lot) => ({
      ...lot,
      createdAt: lot.createdAt.toISOString(),
    }));
  }
}
