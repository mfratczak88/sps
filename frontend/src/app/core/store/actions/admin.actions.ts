import { Id, OperationTimeDays } from '../../model/common.model';
import { Navigate } from '@ngxs/router-plugin';
import { AdminPaths, TopLevelPaths } from '../../../routes';
import { Role } from '../../model/auth.model';

export namespace AdminActions {
  export class GetDriverDetails {
    static readonly type = '[Admin Dashboard Drivers] GetDriverDetails';

    constructor(readonly id: Id) {}
  }
  export class GetAllDrivers {
    static readonly type = '[Admin Dashboard Drivers] GetAll';
  }
  export class AssignParkingLot {
    static readonly type = '[Admin Dashboard Drivers] AssignParkingLot';

    constructor(readonly driverId: Id, readonly parkingLotId: Id) {}
  }
  export class RemoveParkingLotAssignment {
    static readonly type =
      '[Admin Dashboard Drivers] RemoveParkingLotAssignment';

    constructor(readonly driverId: Id, readonly parkingLotId: Id) {}
  }

  export class NavigateToDriverDetails extends Navigate {
    constructor(id: Id) {
      super([`${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.DRIVERS}/${id}`]);
    }
  }
  export class CreateParkingLot {
    static readonly type = '[Admin Dashboard Parking Lots] Create';

    constructor(
      readonly capacity: number,
      readonly hoursOfOperation: {
        hourFrom: number;
        hourTo: number;
        validFrom: Date;
        days: OperationTimeDays[];
      },
      readonly address: {
        city: string;
        streetName: string;
        streetNumber: string;
      },
    ) {}
  }
  export class ChangeCapacity {
    static readonly type = '[Admin Dashboard Parking Lots] ChangeCapacity';

    constructor(readonly newCapacity: number, readonly parkingLotId: Id) {}
  }
  export class ChangeOperationHours {
    static readonly type =
      '[Admin Dashboard Parking Lots] ChangeOperationHours';

    constructor(
      readonly hourFrom: number,
      readonly hourTo: number,
      readonly parkingLotId: Id,
    ) {}
  }

  export class GetAllParkingLots {
    static readonly type = '[Admin Dashboard Parking Lots] GetAll';
  }
  export class GetParkingLot {
    static readonly type = '[Admin Dashboard Parking Lots] GetParkingLot';

    constructor(readonly id: Id) {}
  }

  export class GetAllUsers {
    static readonly type = '[Admin Dashboard Users] GetAll';
  }
  export class ChangeUserRole {
    static readonly type = '[Admin Dashboard Users] ChangeRole';

    constructor(readonly userId: Id, readonly role: Role) {}
  }

  export class NavigateToParkingLotDetails extends Navigate {
    constructor(id: Id) {
      super([`${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.PARKING}/${id}`]);
    }
  }
  export class NavigateToCreateParkingLot extends Navigate {
    constructor() {
      super([
        `${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.PARKING}/${AdminPaths.CREATE_PARKING}`,
      ]);
    }
  }
  export class NavigateToParkingLots extends Navigate {
    constructor() {
      super([`${TopLevelPaths.ADMIN_DASHBOARD}/${AdminPaths.PARKING}`]);
    }
  }
}
