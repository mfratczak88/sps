import SpyObj = jasmine.SpyObj;
import { DriversStore } from './drivers.store';

import { ToastService } from '../../../core/service/toast.service';
import { RouterService } from '../../../core/state/router/router.service';
import { DriversService } from './drivers.service';
import { of } from 'rxjs';
import { mockDriver, mockParkingLots } from '../../../../../test/driver.utils';
import { ToastKeys } from '../../../core/translation-keys';
import { DriversApi } from '../../../core/api/drivers.api';
import { ParkingLotQuery } from '../../parking/state/parking-lot.query';

describe('Drivers service', () => {
  let storeSpy: SpyObj<DriversStore>;
  let api: SpyObj<DriversApi>;
  let parkingLotQuery: SpyObj<ParkingLotQuery>;
  let toastServiceSpy: SpyObj<ToastService>;
  let routerServiceSpy: SpyObj<RouterService>;
  let driverService: DriversService;
  beforeEach(() => {
    api = jasmine.createSpyObj('DriversApi', [
      'getAll',
      'assignParkingLot',
      'removeParkingLotAssignment',
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    parkingLotQuery = jasmine.createSpyObj('ParkingLotService', ['selectAll']);
    storeSpy = jasmine.createSpyObj('Store', [
      'setLoading',
      'setActive',
      'set',
      'getValue',
    ]);
    routerServiceSpy = jasmine.createSpyObj('RouterService', ['to404']);
    driverService = new DriversService(
      storeSpy,
      api,
      parkingLotQuery,
      toastServiceSpy,
      routerServiceSpy,
    );
  });

  it('Load calls api get all and sets store', async () => {
    const driverResp = {
      ...mockDriver,
      parkingLots: [...mockParkingLots],
      parkingLotCount: mockParkingLots.length,
    };
    api.getAll.and.returnValue(of([driverResp]));

    driverService.load();

    expect(api.getAll).toHaveBeenCalled();
    expect(storeSpy.set).toHaveBeenCalledWith([driverResp]);
  });

  it('On select if driver is in store it sets active id', async () => {
    const { id } = mockDriver;
    const driverStatesIds = [id];

    storeSpy.getValue.and.returnValue({
      ids: driverStatesIds,
    });

    driverService.select(id);

    expect(storeSpy.setActive).toHaveBeenCalledWith(id);
    expect(api.getAll).not.toHaveBeenCalled();
  });
  it('On select if no driver is found it calls api', async () => {
    storeSpy.getValue.and.returnValue({
      ids: [],
    });
    const { id } = mockDriver;
    api.getAll.and.returnValue(of([mockDriver]));

    driverService.select(id);

    expect(storeSpy.setActive(id));
    expect(api.getAll).toHaveBeenCalled();
  });
  it('On select if driver with this id does not exists redirects to 404', async () => {
    storeSpy.getValue.and.returnValue({
      ids: [],
    });
    const { id } = mockDriver;
    api.getAll.and.returnValue(of([]));

    driverService.select(id);

    expect(storeSpy.setActive).not.toHaveBeenCalled();
    expect(api.getAll).toHaveBeenCalled();
    expect(routerServiceSpy.to404).toHaveBeenCalled();
  });
  it('On assign parking lot calls api, loads the data afterwards and shows success toast', async () => {
    const driverId = '4';
    const parkingLotId = '55';
    api.getAll.and.returnValue(of([mockDriver]));
    api.assignParkingLot.and.returnValue(of(undefined));

    driverService.assignParkingLot(driverId, parkingLotId).subscribe();

    expect(api.assignParkingLot).toHaveBeenCalledWith({
      driverId,
      parkingLotId,
    });
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      ToastKeys.PARKING_LOT_ASSIGNED,
    );
  });
  it('On remove parking lot assignment calls api, loads the data afterwards and shows success toast', async () => {
    const driverId = '4';
    const parkingLotId = '55';
    api.getAll.and.returnValue(of([mockDriver]));
    api.removeParkingLotAssignment.and.returnValue(of(undefined));

    driverService
      .removeParkingLotAssignment({ driverId, parkingLotId })
      .subscribe();

    expect(api.removeParkingLotAssignment).toHaveBeenCalledWith({
      driverId,
      parkingLotId,
    });
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      ToastKeys.PARKING_LOT_ASSIGNMENT_REMOVED,
    );
  });
});
