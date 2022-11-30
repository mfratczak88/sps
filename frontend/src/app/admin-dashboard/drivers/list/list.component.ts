import { Component, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import {
  Button,
  Column,
} from '../../../shared/components/table/table.component';
import { RouterService } from '../../../core/state/router/router.service';
import { DriversQuery } from '../state/drivers.query';

import { DriversService } from '../state/drivers.service';
import { Driver } from '../../../core/model/driver.model';

@Component({
  selector: 'sps-drivers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class DriversListComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  constructor(
    private readonly routerService: RouterService,
    readonly driversQuery: DriversQuery,
    readonly driversService: DriversService,
  ) {}

  ngOnInit(): void {
    this.driversService.load();
  }

  tableColumns: Column[] = [
    { name: 'name', translation: this.translations.NAME },
    { name: 'email', translation: this.translations.EMAIL },
    {
      name: 'parkingLotCount',
      translation: this.translations.ASSIGNED_PARKING_LOTS,
    },
  ];

  tableButtons: Button[] = [
    {
      name: 'details',
      translation: this.translations.COLUMN_DETAILS,
      icon: 'visibility',
      onClick: ({ id }: Driver) => {
        this.routerService.toDriverDetails(id);
      },
    },
  ];
}
