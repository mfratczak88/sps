import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { ParkingLotService } from '../state/parking-lot.service';
import { RouterService } from '../../../core/state/router/router.service';
import { AdminKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  addressForm: FormGroup;

  capacityForm: FormGroup;

  hoursForm: FormGroup;

  translations = AdminKeys;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly parkingService: ParkingLotService,
    private readonly routerService: RouterService,
  ) {
    this.addressForm = this.formBuilder.nonNullable.group({
      city: [null, [LocalizedValidators.required]],
      streetName: [null, [LocalizedValidators.required]],
      streetNumber: [null, [LocalizedValidators.required]],
    });
    this.capacityForm = this.formBuilder.group({
      capacity: [
        null,
        [LocalizedValidators.required, LocalizedValidators.min(1)],
      ],
    });
    this.hoursForm = this.formBuilder.group({
      hours: [{ hourFrom: 6, hourTo: 22 }],
      validFrom: [new Date(Date.now())],
      days: [[0, 1, 2, 3, 4, 5, 6]],
    });
  }

  onCreate() {
    const { city, streetName, streetNumber } = this.addressForm.value;
    const { capacity } = this.capacityForm.value;
    const {
      hours: { hourFrom, hourTo },
      validFrom,
      days,
    } = this.hoursForm.value;
    this.parkingService
      .createParkingLot({
        capacity: Number(capacity),
        address: {
          streetName,
          streetNumber,
          city,
        },
        hoursOfOperation: {
          hourFrom,
          hourTo,
          validFrom,
          days,
        },
      })
      .subscribe(() => this.routerService.toAdminParkingLot());
  }
}
