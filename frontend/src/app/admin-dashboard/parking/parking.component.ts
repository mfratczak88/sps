import { Component, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../core/translation-keys';
import { ParkingLotQuery } from './state/parking-lot.query';
import { ParkingLotService } from './state/parking-lot.service';
import { Button, Column } from '../../shared/components/table/table.component';
import { map } from 'rxjs/operators';
import { RouterService } from '../../core/state/router/router.service';
import { ParkingLot } from './state/parking-lot.model';

@Component({
  selector: 'sps-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss'],
})
export class ParkingComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  tableColumns: Column[] = [
    { name: 'address', translation: this.translations.COLUMN_ADDRESS },
    { name: 'capacity', translation: this.translations.CAPACITY },
    { name: 'hours', translation: this.translations.HOURS },
  ];

  tableButtons: Button[] = [
    {
      name: 'details',
      translation: this.translations.COLUMN_DETAILS,
      icon: 'visibility',
      onClick: ({ id }: ParkingLot) =>
        this.routerService.toAdminParkingLotDetails(id),
    },
  ];

  constructor(
    readonly parkingLotQuery: ParkingLotQuery,
    readonly parkingLotService: ParkingLotService,
    readonly routerService: RouterService,
  ) {}

  ngOnInit(): void {
    this.parkingLotService.load();
  }

  parkingLots$() {
    return this.parkingLotQuery.selectAll().pipe(
      map(parkingLots =>
        parkingLots.map(lot => ({
          ...lot,
          hours: `${lot.hourFrom} - ${lot.hourTo}`,
          address: `${lot.streetName} ${lot.streetNumber}, ${lot.city}`,
        })),
      ),
    );
  }
}
