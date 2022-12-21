import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { HoursFormComponent } from '../../../shared/components/hours-form/hours-form.component';
import { DriverKeys, MiscKeys } from '../../../core/translation-keys';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { Select, Store } from '@ngxs/store';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import { ReservationValidator } from '../../../core/validators/reservation.validator';
import { DriversState } from '../../../core/store/drivers.state';
import { Observable } from 'rxjs';
import { Driver } from '../../../core/model/driver.model';

interface HoursForm {
  hours: FormControl<{ hourFrom: number; hourTo: number } | null>;
}

interface DateForm {
  date: FormControl<Date | null>;
}

interface ParkingLotForm {
  parkingLot: FormControl<ParkingLot | null>;
}

interface LicensePlateForm {
  licensePlate: FormControl<string | null>;
}

@Component({
  selector: 'sps-create-reservation',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateReservationComponent {
  translations = { ...DriverKeys, ...MiscKeys };

  @ViewChild('hoursFormComponent')
  hoursFormComponent: HoursFormComponent;

  @Select(DriversState.currentDriver)
  driver$: Observable<Driver>;

  @Select(DriversState.assignedParkingLots)
  parkingLots$: Observable<ParkingLot[]>;

  hoursForm = this.formBuilder.group<HoursForm>({
    hours: new FormControl({ hourFrom: 6, hourTo: 22 }, [
      LocalizedValidators.required,
    ]),
  });

  parkingLotForm = this.formBuilder.group<ParkingLotForm>({
    parkingLot: new FormControl(null, [LocalizedValidators.required]),
  });

  dateForm = this.formBuilder.group<DateForm>({
    date: new FormControl(null, [LocalizedValidators.required]),
  });

  vehicleForm = this.formBuilder.group<LicensePlateForm>({
    licensePlate: new FormControl('', [LocalizedValidators.required]),
  });

  dateFilter = this.validReservationDate().bind(this);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly reservationValidator: ReservationValidator,
  ) {
    this.parkingLotForm.valueChanges.subscribe(({ parkingLot }) => {
      if (!this.parkingLotForm.invalid && parkingLot) {
        const { hourFrom, hourTo } = parkingLot;
        this.hoursFormComponent.hourFrom = hourFrom;
        this.hoursFormComponent.hourTo = hourTo;
        this.hoursForm.controls.hours.setValue({
          hourFrom,
          hourTo: hourTo,
        });
      }
    });
  }

  onCreate() {
    const { date } = this.dateForm.value;
    const { parkingLot } = this.parkingLotForm.value;
    const { hours } = this.hoursForm.value;
    const { licensePlate } = this.vehicleForm.value;
    if (date && parkingLot && hours && licensePlate)
      this.store
        .dispatch(
          new DriverActions.CreateReservation(
            licensePlate,
            parkingLot.id,
            hours,
            date,
          ),
        )
        .subscribe(() =>
          this.store.dispatch(new DriverActions.NavigateToReservationList()),
        );
  }

  private validReservationDate() {
    const parkingLot = this.parkingLotForm.controls.parkingLot.value;
    return this.reservationValidator.dateFilterFn(parkingLot?.id).bind(this);
  }
}
