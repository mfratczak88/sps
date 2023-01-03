import { Id } from '../../model/common.model';
import { today } from '../../util';

export namespace ClerkActions {
  export class LoadLicensePlates {
    static readonly type = '[Clerk Dashboard] LoadLicensePlates';
  }
  export class SearchLicensePlates {
    static readonly type = '[Clerk Dashboard] SearchLicensePlates';

    constructor(readonly licensePlate: string) {}
  }

  export class LicensePlateChosen {
    static readonly type =
      '[Clerk Dashboard Reservations Search] LicensePlateChosen';

    constructor(readonly licensePlate: string) {}
  }

  export class LicensePlateCleared {
    static readonly type =
      '[Clerk Dashboard Reservations Search] LicensePlateCleared';
  }

  export class ApplyLicensePlateFilter {
    static readonly type =
      '[Clerk Dashboard Reservations Search] ApplyLicensePlateFilter';

    constructor(
      readonly licensePlate: string,
      readonly startTime: Date = today(),
    ) {}
  }

  export class FindReservations {
    static readonly type = '[Clerk Dashboard Reservations] Find';
  }

  export class IssueParkingTicket {
    static readonly type = '[Clerk Dashboard Reservations] IssueParkingTicket';

    constructor(readonly reservationId: Id) {}
  }
  export class ReturnParkingTicket {
    static readonly type = '[Clerk Dashboard Reservations] ReturnParkingTicket';

    constructor(readonly reservationId: Id) {}
  }
}
