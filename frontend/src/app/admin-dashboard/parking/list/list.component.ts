import { Component, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import {
  Button,
  Column,
} from '../../../shared/components/table/table.component';
import { ParkingLot } from '../state/parking-lot.model';
import { ParkingLotQuery } from '../state/parking-lot.query';
import { ParkingLotService } from '../state/parking-lot.service';
import { RouterService } from '../../../core/state/router/router.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sps-parking-lot-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
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
