import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { mockReservations } from '../../../../../test/reservation.util';
import { newMatDialogSpy } from '../../../../../test/spy.util';
import { translateTestModule } from '../../../../test.utils';
import { CoreModule } from '../../../core/core.module';
import { CanCancelReservationPipe } from '../../../core/pipe/can/can-cancel-reservation.pipe';
import { CanConfirmReservationPipe } from '../../../core/pipe/can/can-confirm-reservation.pipe';
import { CanEditReservationPipe } from '../../../core/pipe/can/can-edit-reservation.pipe';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import {
  defaults,
  ReservationsState,
} from '../../../core/store/reservations/reservations.state';
import { ReservationValidator } from '../../../core/validators/reservation.validator';
import { SharedModule } from '../../../shared/shared.module';
import { ReservationDetailsComponent } from './details.component';
import SpyObj = jasmine.SpyObj;
import Spy = jasmine.Spy;

describe('Reservation details', () => {
  let fixture: ComponentFixture<ReservationDetailsComponent>;
  let dialogSpy: SpyObj<MatDialog>;
  let store: Store;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  let dispatchSpy: Spy<(actionOrActions: any) => Observable<any>>;
  let reservationsValidatorSpy: SpyObj<ReservationValidator>;
  const [reservation] = mockReservations;
  const { id: reservationId } = reservation;
  const cancelButton = () =>
    fixture.debugElement.query(By.css('.actions__cancel-button'))
      ?.nativeElement as HTMLButtonElement;

  const editButton = () =>
    fixture.debugElement.query(By.css('.actions__edit-button'))
      ?.nativeElement as HTMLButtonElement;

  const confirmButton = () =>
    fixture.debugElement.query(By.css('.actions__confirm-button'))
      ?.nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    dialogSpy = newMatDialogSpy();
    reservationsValidatorSpy = jasmine.createSpyObj('ReservationsValidator', [
      'dateFilterFn',
    ]);
    reservationsValidatorSpy.dateFilterFn.and.returnValue(() => true);
    await TestBed.configureTestingModule({
      imports: [
        await translateTestModule(),
        SharedModule,
        CoreModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        NgxsModule.forRoot([ReservationsState]),
        NgxsRouterPluginModule.forRoot(),
      ],
      declarations: [ReservationDetailsComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogSpy,
        },
        {
          provide: ReservationValidator,
          useValue: reservationsValidatorSpy,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReservationDetailsComponent);
    store = TestBed.inject(Store);
    store.reset({
      ...store.snapshot(),
      reservations: {
        ...defaults,
        entities: {
          [reservationId]: reservation,
        },
        selectedId: reservationId,
        loading: false,
      },
      router: {
        state: {
          params: {
            reservationId,
          },
        },
      },
    });
    dispatchSpy = spyOn(store, 'dispatch');
  });
  it('Triggers GetReservationById action on init', () => {
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new DriverActions.GetReservationById(reservationId),
    );
  });
  it('Hides action buttons when reservation cant be changed', () => {
    spyOn(CanEditReservationPipe.prototype, 'transform').and.returnValue(false);

    fixture.detectChanges();

    expect(editButton()).toBeFalsy();
    expect(confirmButton()).toBeFalsy();
    expect(cancelButton()).toBeFalsy();
  });
  it('Hides cancel button when cannot be cancelled', () => {
    spyOn(CanEditReservationPipe.prototype, 'transform').and.returnValue(true);
    spyOn(CanCancelReservationPipe.prototype, 'transform').and.returnValue(
      false,
    );
    fixture.detectChanges();

    expect(cancelButton()).toBeFalsy();
  });
  it('Hides confirm button when cannot be confirmed', () => {
    spyOn(CanEditReservationPipe.prototype, 'transform').and.returnValue(true);
    spyOn(CanCancelReservationPipe.prototype, 'transform').and.returnValue(
      false,
    );
    fixture.detectChanges();

    expect(confirmButton()).toBeFalsy();
  });
  it('Calls modal to confirm on confirm button click', () => {
    spyOn(CanEditReservationPipe.prototype, 'transform').and.returnValue(true);
    spyOn(CanConfirmReservationPipe.prototype, 'transform').and.returnValue(
      true,
    );
    fixture.detectChanges();

    const button = confirmButton();

    button.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
  it('Calls modal to cancel on button click', () => {
    spyOn(CanEditReservationPipe.prototype, 'transform').and.returnValue(true);
    spyOn(CanCancelReservationPipe.prototype, 'transform').and.returnValue(
      true,
    );
    fixture.detectChanges();

    const button = cancelButton();

    button.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
  it('Calls modal to edit on button click', () => {
    spyOn(CanEditReservationPipe.prototype, 'transform').and.returnValue(true);
    fixture.detectChanges();
    const button = editButton();

    button.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
