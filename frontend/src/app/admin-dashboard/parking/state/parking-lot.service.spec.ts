import { ParkingLotService } from './parking-lot.service';
import { ToastService } from '../../../core/service/toast.service';
import { RouterService } from '../../../core/state/router/router.service';
import { ParkingLotStore } from './parking-lot.store';
import { ParkingLotApi } from './parking-lot.api';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { of } from 'rxjs';
import {
  ChangeHoursOfOperations,
  CreateParkingLot,
} from '../../../core/model/parking-lot.model';
import { ToastKeys } from '../../../core/translation-keys';
import SpyObj = jasmine.SpyObj;

describe('Parking lot service', () => {
  let storeSpy: SpyObj<ParkingLotStore>;
  let api: SpyObj<ParkingLotApi>;
  let toastServiceSpy: SpyObj<ToastService>;
  let routerServiceSpy: SpyObj<RouterService>;
  let parkingLotService: ParkingLotService;
  beforeEach(() => {
    api = jasmine.createSpyObj('ParkingApi', [
      'getAll',
      'changeHours',
      'changeCapacity',
      'create',
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    storeSpy = jasmine.createSpyObj('Store', [
      'setLoading',
      'setActive',
      'set',
      'getValue',
    ]);
    routerServiceSpy = jasmine.createSpyObj('RouterService', ['to404']);
    parkingLotService = new ParkingLotService(
      api,
      storeSpy,
      toastServiceSpy,
      routerServiceSpy,
    );
  });
  it('Sets loaded values to the store', async () => {
    const lots = mockParkingLots;
    api.getAll.and.returnValue(of(lots));

    parkingLotService.load();

    expect(api.getAll).toHaveBeenCalled();
    expect(storeSpy.set).toHaveBeenCalledWith(lots);
  });
  it('Change hours - calls api, reloads the store and show toast', async () => {
    api.getAll.and.returnValue(of(mockParkingLots));
    api.changeHours.and.returnValue(of(undefined));
    const hoursChange: ChangeHoursOfOperations = {
      hourFrom: '10:00',
      hourTo: '13:00',
    };
    const parkingLotId = mockParkingLots[0].id;
    parkingLotService
      .changeOperationHours(hoursChange, parkingLotId)
      .subscribe();

    expect(api.changeHours).toHaveBeenCalledWith(hoursChange, parkingLotId);
    expect(storeSpy.set).toHaveBeenCalledWith(mockParkingLots);
    expect(toastServiceSpy.show).toHaveBeenCalledWith(ToastKeys.HOURS_CHANGED);
  });
  it('Change capacity - calls api, reloads the store and show toast', async () => {
    api.getAll.and.returnValue(of(mockParkingLots));
    api.changeCapacity.and.returnValue(of(undefined));
    const capacity = 10000;
    const parkingLotId = mockParkingLots[0].id;
    parkingLotService.changeCapacity(capacity, parkingLotId).subscribe();

    expect(api.changeCapacity).toHaveBeenCalledWith(capacity, parkingLotId);
    expect(storeSpy.set).toHaveBeenCalledWith(mockParkingLots);
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      ToastKeys.CAPACITY_CHANGED,
    );
  });
  it('Create parking lot - calls api, reloads the store and show toast', () => {
    api.getAll.and.returnValue(of(mockParkingLots));
    api.create.and.returnValue(of({}));
    const createLot: CreateParkingLot = {
      address: {
        city: 'Warszawa',
        streetName: 'Pileckiego',
        streetNumber: '44',
      },
      hoursOfOperation: {
        hourTo: '10:00',
        hourFrom: '07:00',
      },
      capacity: 10,
    };
    parkingLotService.createParkingLot(createLot).subscribe();

    expect(api.create).toHaveBeenCalledWith(createLot);
    expect(storeSpy.set).toHaveBeenCalledWith(mockParkingLots);
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      ToastKeys.PARKING_LOT_CREATED,
    );
  });
  it('Select - sets active entity if store have it', () => {
    const activeLot = mockParkingLots[0];
    const { id } = activeLot;
    storeSpy.getValue.and.returnValue({
      ids: [id],
    });
    parkingLotService.select(id);

    expect(storeSpy.setActive).toHaveBeenCalledWith(id);
  });
  it('Select - if store doesnt hold active entity reloads the lots and sets the store', () => {
    const activeLot = mockParkingLots[0];
    const { id } = activeLot;
    storeSpy.getValue.and.returnValue({
      ids: [],
    });
    api.getAll.and.returnValue(of(mockParkingLots));

    parkingLotService.select(id);

    expect(api.getAll).toHaveBeenCalled();
    expect(storeSpy.setActive).toHaveBeenCalledWith(id);
    expect(storeSpy.set).toHaveBeenCalledWith(mockParkingLots);
  });
});
