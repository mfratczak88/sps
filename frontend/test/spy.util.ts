import SpyObj = jasmine.SpyObj;
import { RouterService } from 'src/app/core/state/router/router.service';
import { RouterQuery } from 'src/app/core/state/router/router.query';
import { ReservationsService } from '../src/app/driver-dashboard/state/reservation/reservations.service';
import { ReservationsQuery } from '../src/app/driver-dashboard/state/reservation/reservations.query';
import { DriverService } from '../src/app/driver-dashboard/state/driver/driver.service';
import { DriverQuery } from '../src/app/driver-dashboard/state/driver/driver.query';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export const newReservationsServiceSpy = (): SpyObj<ReservationsService> =>
  jasmine.createSpyObj('ReservationsService', [
    'loadForDriver',
    'reloadOnPagingChange$',
    'select',
    'canBeChanged',
    'canBeConfirmed',
    'canBeCancelled',
    'confirmReservation',
    'cancelReservation',
    'makeReservation',
    'hoursOf',
    'dateValidator',
    'changeTime',
  ]);

export const newMatDialogRefSpy = <T>(): SpyObj<MatDialogRef<T>> =>
  jasmine.createSpyObj('MatDialogRef', ['close']);

export const newMatDialogSpy = (): SpyObj<MatDialog> =>
  jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);

export const newReservationsQuerySpy = (): SpyObj<ReservationsQuery> =>
  jasmine.createSpyObj('ReservationsQuery', [
    'driverReservationHistory$',
    'count$',
    'active$',
    'selectLoading',
  ]);

export const newRouterQuerySpy = (): SpyObj<RouterQuery> =>
  jasmine.createSpyObj('RouterQuery', [
    'breadCrumbs$',
    'emailFragment$',
    'queryParams$',
    'activationGuid',
    'getParam',
    'parkingLotId',
    'reservationId$',
    'driverId',
    'getPageQueryParam',
    'getPageSizeQueryParam',
    'getSortingQueryParams',
    'previousActivationGuid',
  ]);

export const newDriverServiceSpy = (): SpyObj<DriverService> =>
  jasmine.createSpyObj('DriverService', [
    'load',
    'loadReservations$',
    'addVehicle',
  ]);

export const newDriverQuerySpy = (): SpyObj<DriverQuery> =>
  jasmine.createSpyObj('DriverQuery', [
    'loaded$',
    'unAssignedParkingLots$',
    'selectLoading',
  ]);

export const newRouterServiceSpy = (): SpyObj<RouterService> =>
  jasmine.createSpyObj('RouterService', [
    'urlTreeForLoginWithReturnUrl',
    'adminDashBoardUrlTree',
    'clerkDashboardUrlTree',
    'driverDashboardUrlTree',
    'toAdminParkingLotDetails',
    'toCreateReservation',
    'unAuthorizedUrlTree',
    'toAdminParkingLot',
    'toCreateParkingLot',
    'toSameRoute',
    'toRoot',
    'reload',
    'toSignUp',
    'toSignIn',
    'toPasswordReset',
    'toInternalServerErrorPage',
    'navigateAfterLogin',
    'to404',
    'toResendActivationLink',
    'changeQueryParams',
    'toDriverDetails',
    'toDriverReservationDetails',
    'toDriverReservations',
  ]);
