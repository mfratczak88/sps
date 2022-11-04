import { Module, Provider } from '@nestjs/common';
import { ParkingLotService } from './parking-lot/parking-lot.service';
import { IdGenerator } from '../domain/id';
import { ParkingLotRepository } from '../domain/parking-lot.repository';
import { DriverService } from './driver/driver.service';
import { DriverRepository } from '../domain/driver.repository';

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
];

@Module({
  providers: providers,
  exports: providers,
})
export class ApplicationModule {}
