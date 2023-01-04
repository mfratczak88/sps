import { Id } from '../../model/common.model';
import { Hours } from '../../model/reservation.model';
import { Navigate } from '@ngxs/router-plugin';
import { DriverPaths, TopLevelPaths } from '../../../routes';
import { GetById, MutationById, PageChange, SortChange } from './base.actions';

export namespace DriverActions {
  export class GetAllReservations {
    static readonly type = '[Driver Reservations] GetAll';
  }

  export class SortingChange extends SortChange {
    static readonly type = '[Driver Reservations] Sorting change';
  }

  export class PagingChange extends PageChange {
    static readonly type = '[Driver Reservations] Paging change';
  }
  export class ReservationFiltersChange {
    static readonly type = '[Driver Reservations] FiltersChange';

    constructor(readonly driverId?: Id, readonly onlyHistory?: boolean) {}
  }
  export class GetReservationById extends GetById {
    static readonly type = '[Driver Reservations] GetById';
  }

  export class CancelReservation extends MutationById {
    static readonly type = '[Driver Reservations] Cancel';
  }

  export class ConfirmReservation extends MutationById {
    static readonly type = '[Driver Reservations] Confirm';
  }

  export class ChangeTimeOfReservation {
    static readonly type = '[Driver Reservations] ChangeTime';

    constructor(
      readonly reservationId: Id,
      readonly hours: Hours,
      readonly date: Date,
    ) {}
  }

  export class CreateReservation {
    static readonly type = '[Driver Reservations] ChangeTime';

    constructor(
      readonly licensePlate: string,
      readonly parkingLotId: Id,
      readonly hours: Hours,
      readonly date: Date,
    ) {}
  }
  export class ReservationChanged extends MutationById {
    static readonly type = '[Reservations] Change';
  }

  export class GetParkingLots {
    static readonly type = '[Driver Parking Lots] GetAll';
  }

  export class GetDriverDetails extends GetById {
    static readonly type = '[Driver Dashboard] GetDriverDetails';
  }

  export class AddVehicle {
    static readonly type = '[Driver Dashboard] AddVehicle';

    constructor(readonly licensePlate: string) {}
  }

  export class NavigateToCreateReservation extends Navigate {
    constructor() {
      super([
        `/${TopLevelPaths.DRIVER_DASHBOARD}/${DriverPaths.RESERVATIONS}/${DriverPaths.CREATE_RESERVATION}`,
      ]);
    }
  }

  export class NavigateToReservationDetails extends Navigate {
    constructor(readonly id: Id) {
      super([
        `/${TopLevelPaths.DRIVER_DASHBOARD}/${DriverPaths.RESERVATIONS}/${id}`,
      ]);
    }
  }
  export class NavigateToReservationList extends Navigate {
    constructor() {
      super([`/${TopLevelPaths.DRIVER_DASHBOARD}/${DriverPaths.RESERVATIONS}`]);
    }
  }
}
