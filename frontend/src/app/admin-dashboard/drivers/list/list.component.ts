import { Component, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import {
  Button,
  Column,
} from '../../../shared/components/table/table.component';
import { Driver } from '../../../core/model/driver.model';
import { Store } from '@ngxs/store';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import {
  driversWithParkingLotCount,
  loading,
} from '../../../core/store/drivers/drivers.selectors';

@Component({
  selector: 'sps-drivers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class DriversListComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  loading$ = this.store.select(loading);

  drivers$ = this.store.select(driversWithParkingLotCount);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new AdminActions.GetAllDrivers());
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
      onClick: ({ id }: Driver) =>
        this.store.dispatch(new AdminActions.NavigateToDriverDetails(id)),
    },
  ];
}
