import { Id } from '../../model/common.model';
import { Hours, SortBy, SortOrder } from '../../model/reservation.model';
import { Navigate } from '@ngxs/router-plugin';
import { DriverPaths, TopLevelPaths } from '../../../routes';

export namespace DriverActions {
  export class GetAllReservations {
    static readonly type = '[Driver Reservations] GetAll';
  }

  export class TablePagingSortingChange {
    static readonly type = '[Driver Reservations] TablePagingSortingChange';

    constructor(
      readonly page?: number,
      readonly pageSize?: number,
      readonly sortBy?: SortBy,
      readonly sortOrder?: SortOrder,
    ) {}
  }
  export class ReservationFiltersChange {
    static readonly type = '[Driver Reservations] FiltersChange';

    constructor(readonly driverId?: Id, readonly onlyHistory?: boolean) {}
  }
  export class GetReservationById {
    static readonly type = '[Driver Reservations] GetById';

    constructor(readonly id: Id) {}
  }

  export class CancelReservation {
    static readonly type = '[Driver Reservations] Cancel';

    constructor(readonly id: Id) {}
  }

  export class ConfirmReservation {
    static readonly type = '[Driver Reservations] Confirm';

    constructor(readonly id: Id) {}
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
  export class ReservationChanged {
    static readonly type = '[Reservations] Change';

    constructor(readonly id: Id) {}
  }

  export class GetParkingLots {
    static readonly type = '[Driver Parking Lots] GetAll';
  }

  export class GetDriverDetails {
    static readonly type = '[Driver Dashboard] GetDriverDetails';

    constructor(readonly id: Id) {}
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
