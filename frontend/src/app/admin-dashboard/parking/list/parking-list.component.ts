import { Component, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Button } from '../../../shared/components/table/table.component';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { ParkingLotQuery } from '../state/parking-lot.query';
import { ParkingLotService } from '../state/parking-lot.service';
import { RouterService } from '../../../core/state/router/router.service';

@Component({
  selector: 'sps-parking-lot-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ParkingListComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

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
}
