import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { DriverQuery } from '../../state/driver/driver.query';
import { DriverService } from '../../state/driver/driver.service';

import { DateTime } from 'luxon';
import { HoursFormComponent } from '../../../shared/components/hours-form/hours-form.component';
import { DriverKeys, MiscKeys } from '../../../core/translation-keys';
import { first } from 'rxjs';
import { ParkingLot } from '../../../core/model/parking-lot.model';

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

  dateFilter = this.validReservationDate.bind(this);

  constructor(
    private readonly formBuilder: FormBuilder,
    readonly driverQuery: DriverQuery,
    private readonly driverService: DriverService,
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
      this.driverService
        .makeReservation({
          hours,
          date,
          parkingLotId: parkingLot.id,
          licensePlate,
        })
        .pipe(first())
        .subscribe();
  }

  private validReservationDate(date: Date | null) {
    const parkingLot = this.parkingLotForm.controls.parkingLot.value;
    if (!parkingLot || !date) return true;
    return parkingLot.days.includes(DateTime.fromJSDate(date).weekday - 1);
  }
}
