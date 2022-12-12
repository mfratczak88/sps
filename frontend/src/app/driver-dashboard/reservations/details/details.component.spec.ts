import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDetailsComponent } from './details.component';
import SpyObj = jasmine.SpyObj;
import { ReservationsService } from '../../state/reservation/reservations.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterQuery } from '../../../core/state/router/router.query';
import { RouterService } from '../../../core/state/router/router.service';
import { ReservationsQuery } from '../../state/reservation/reservations.query';
import { translateTestModule } from '../../../../test.utils';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  newMatDialogSpy,
  newReservationsQuerySpy,
  newReservationsServiceSpy,
  newRouterQuerySpy,
  newRouterServiceSpy,
} from '../../../../../test/spy.util';
import { mockReservations } from '../../../../../test/reservation.util';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('Reservation details', () => {
  let fixture: ComponentFixture<ReservationDetailsComponent>;
  let reservationServiceSpy: SpyObj<ReservationsService>;
  let dialogSpy: SpyObj<MatDialog>;
  let routerQuerySpy: SpyObj<RouterQuery>;
  let routerServiceSpy: SpyObj<RouterService>;
  let reservationsQuerySpy: SpyObj<ReservationsQuery>;
  const [reservation] = mockReservations;

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
    reservationServiceSpy = newReservationsServiceSpy();
    dialogSpy = newMatDialogSpy();
    routerQuerySpy = newRouterQuerySpy();
    routerServiceSpy = newRouterServiceSpy();
    routerQuerySpy.reservationId$.and.returnValue(of(reservation.id));
    reservationsQuerySpy = newReservationsQuerySpy();
    reservationsQuerySpy.active$.and.returnValue(of(reservation));
    reservationServiceSpy.select.and.returnValue(of(reservation));
    reservationsQuerySpy.selectLoading.and.returnValue(of(false));
    reservationServiceSpy.dateValidator.and.returnValue(() => false);

    await TestBed.configureTestingModule({
      imports: [
        await translateTestModule(),
        SharedModule,
        BrowserAnimationsModule,
      ],
      declarations: [ReservationDetailsComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogSpy,
        },
        {
          provide: ReservationsService,
          useValue: reservationServiceSpy,
        },
        {
          provide: ReservationsQuery,
          useValue: reservationsQuerySpy,
        },
        {
          provide: RouterQuery,
          useValue: routerQuerySpy,
        },
        {
          provide: RouterService,
          useValue: routerServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationDetailsComponent);
  });

  it('Hides action buttons when reservation cant be changed', () => {
    reservationServiceSpy.canBeChanged.and.returnValue(false);
    fixture.detectChanges();
    expect(editButton()).toBeFalsy();
    expect(confirmButton()).toBeFalsy();
    expect(cancelButton()).toBeFalsy();
  });
  it('Hides cancel button when cannot be cancelled', () => {
    reservationServiceSpy.canBeChanged.and.returnValue(true);
    reservationServiceSpy.canBeCancelled.and.returnValue(false);
    fixture.detectChanges();

    expect(cancelButton()).toBeFalsy();
  });
  it('Hides confirm button when cannot be confirmed', () => {
    reservationServiceSpy.canBeChanged.and.returnValue(true);
    reservationServiceSpy.canBeCancelled.and.returnValue(false);
    fixture.detectChanges();

    expect(confirmButton()).toBeFalsy();
  });
  it('Calls modal to confirm on confirm button click', () => {
    reservationServiceSpy.canBeChanged.and.returnValue(true);
    reservationServiceSpy.canBeConfirmed.and.returnValue(true);
    fixture.detectChanges();

    const button = confirmButton();

    button.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
  it('Calls modal to cancel on button click', () => {
    reservationServiceSpy.canBeChanged.and.returnValue(true);
    reservationServiceSpy.canBeCancelled.and.returnValue(true);
    fixture.detectChanges();

    const button = cancelButton();

    button.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
  it('Calls modal to edit on button click', () => {
    reservationServiceSpy.canBeChanged.and.returnValue(true);
    fixture.detectChanges();
    const button = editButton();

    button.click();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
