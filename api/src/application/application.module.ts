import { Module, Provider } from '@nestjs/common';
import { ParkingLotService } from './parking-lot/parking-lot.service';
import { IdGenerator } from '../domain/id';
import { ParkingLotRepository } from '../domain/parking-lot/parking-lot.repository';
import { DriverService } from './driver/driver.service';
import { DriverRepository } from '../domain/driver/driver.repository';
import { ReservationService } from './reservation/reservation.service';
import { ParkingLotAvailability } from '../domain/parking-lot-availability';
import { ReservationRepository } from '../domain/reservation/reservation.repository';

const providers: Provider[] = [
  {
    provide: ParkingLotService,
    useFactory: (idGenerator: IdGenerator, repo: ParkingLotRepository) =>
      new ParkingLotService(idGenerator, repo),
    inject: [IdGenerator, ParkingLotRepository],
  },
  {
    provide: DriverService,
    useFactory: (repo: DriverRepository) => new DriverService(repo),
    inject: [DriverRepository],
  },

  {
    provide: ReservationService,
    useFactory: (
      repo: ReservationRepository,
      parkingLotAvailability: ParkingLotAvailability,
      idGenerator: IdGenerator,
    ) => new ReservationService(repo, idGenerator, parkingLotAvailability),
    inject: [ReservationRepository, ParkingLotAvailability, IdGenerator],
  },
];

@Module({
  providers: providers,
  exports: providers,
})
export class ApplicationModule {}
