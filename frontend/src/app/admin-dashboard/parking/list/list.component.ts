import { Component } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Button } from '../../../shared/components/table/table.component';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { Store } from '@ngxs/store';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import {
  loading,
  parkingLots,
} from '../../../core/store/parking-lot/parking-lot.selectors';

@Component({
  selector: 'sps-parking-lot-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ParkingListComponent {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  readonly loading$ = this.store.select(loading);

  readonly parkingLots$ = this.store.select(parkingLots);

  tableButtons: Button[] = [
    {
      name: 'details',
      translation: this.translations.COLUMN_DETAILS,
      icon: 'visibility',
      onClick: ({ id }: ParkingLot) =>
        this.store.dispatch(new AdminActions.NavigateToParkingLotDetails(id)),
    },
  ];

  constructor(readonly store: Store) {}

  toCreateParkingLot() {
    this.store.dispatch(new AdminActions.NavigateToCreateParkingLot());
  }
}
