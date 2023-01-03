import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClerkActions } from '../../../core/store/actions/clerk.actions';
import {
  loading as reservationsLoading,
  reservations,
} from '../../../core/store/reservations/reservations.selector';
import {
  licensePlateFound,
  loading as licensePlatesLoading,
} from '../../store/vehicles-search.selector';
import { ClerkKeys, DrawerKeys } from '../../../core/translation-keys';

@UntilDestroy()
@Component({
  selector: 'sps-vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.scss'],
})
export class VehicleSearchComponent implements OnInit {
  translations = { ...ClerkKeys, ...DrawerKeys };

  inputFormElement = new FormControl('', [LocalizedValidators.required]);

  reservations$ = this.store.select(reservations);

  reservationsLoading$ = this.store.select(reservationsLoading);

  licensePlatesLoading$ = this.store.select(licensePlatesLoading);

  searchResults$ = this.store.select(licensePlateFound);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.inputFormElement.valueChanges
      .pipe(untilDestroyed(this), debounceTime(400), distinctUntilChanged())
      .subscribe(licensePlate =>
        licensePlate
          ? this.store.dispatch(
              new ClerkActions.SearchLicensePlates(licensePlate),
            )
          : this.store.dispatch(new ClerkActions.LicensePlateCleared()),
      );
  }

  onLicensePlateSelected(licensePlate: string) {
    this.store.dispatch(new ClerkActions.LicensePlateChosen(licensePlate));
  }
}
