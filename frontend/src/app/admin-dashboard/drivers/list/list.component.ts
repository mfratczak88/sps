import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Driver } from '../../../core/model/driver.model';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import {
  driversWithParkingLotCount,
  loading,
} from '../../../core/store/drivers/drivers.selectors';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Button } from '../../../shared/components/table/table.component';

@Component({
  selector: 'sps-drivers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class DriversListComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  loading$ = this.store.select(loading);

  drivers$ = this.store.select(driversWithParkingLotCount);

  tableButtons: Button[] = [
    {
      name: 'details',
      translation: this.translations.COLUMN_DETAILS,
      icon: 'visibility',
      onClick: ({ id }: Driver) =>
        this.store.dispatch(new AdminActions.NavigateToDriverDetails(id)),
    },
  ];

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new AdminActions.GetAllDrivers());
  }
}
