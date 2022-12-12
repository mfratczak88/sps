import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ParkingLotApi } from './parking-lot.api';
import { TestBed } from '@angular/core/testing';
import { OperationTimeDays } from '../model/common.model';
import {
  ChangeHoursOfOperations,
  CreateParkingLot,
} from '../model/parking-lot.model';

describe('Parking lot api spec', () => {
  let httpTestingController: HttpTestingController;
  let api: ParkingLotApi;
  beforeEach(() => {
    const moduleRef = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ParkingLotApi],
    });
    api = moduleRef.inject(ParkingLotApi);
    httpTestingController = moduleRef.inject(HttpTestingController);
  });

  it('Get all calls api with base url', async () => {
    api.getAll().subscribe();

    const req = httpTestingController.expectOne(api.BASE_URL);

    expect(req.request.method).toEqual('GET');

    req.flush([]);
    httpTestingController.verify();
  });
  it('Change hours sends patch request with csrf token', async () => {
    const req: ChangeHoursOfOperations = {
      hourFrom: 10,
      hourTo: 12,
    };
    const parkingLotId = '44';

    api.changeHours(req, parkingLotId).subscribe();

    const tokenReq = httpTestingController.expectOne(api.CSRF_TOKEN_URL);
    expect(tokenReq.request.method).toEqual('GET');
    tokenReq.flush({ csrfToken: '442' });

    const changeHoursReq = httpTestingController.expectOne(
      `${api.BASE_URL}/${parkingLotId}/${api.HOURS_URI}`,
    );
    expect(changeHoursReq.request.method).toEqual('PATCH');
    expect(changeHoursReq.request.body).toEqual({
      ...req,

      parkingLotId,
    });

    changeHoursReq.flush({});
    httpTestingController.verify();
  });
  it('Create sends post request with csrf token', () => {
    const payload: CreateParkingLot = {
      hoursOfOperation: {
        hourFrom: 10,
        hourTo: 12,
        days: [OperationTimeDays.WEDNESDAY],
        validFrom: new Date(Date.now()),
      },
      address: {
        streetNumber: '4',
        streetName: 'Małeckiego',
        city: 'Bydgoszcz',
      },
      capacity: 400,
    };

    api.create(payload).subscribe();

    const tokenReq = httpTestingController.expectOne(api.CSRF_TOKEN_URL);
    expect(tokenReq.request.method).toEqual('GET');
    tokenReq.flush({ csrfToken: '44443332' });

    const createReq = httpTestingController.expectOne(`${api.BASE_URL}`);
    expect(createReq.request.method).toEqual('POST');
    expect(createReq.request.body).toEqual(payload);

    createReq.flush({});
    httpTestingController.verify();
  });
  it('Change capacity sends patch request with csrf token', () => {
    const capacity = 1000;
    const parkingLotId = '12';

    api.changeCapacity(capacity, parkingLotId).subscribe();

    const tokenReq = httpTestingController.expectOne(api.CSRF_TOKEN_URL);
    expect(tokenReq.request.method).toEqual('GET');
    tokenReq.flush({ csrfToken: '44444' });

    const changeCapacityReq = httpTestingController.expectOne(
      `${api.BASE_URL}/${parkingLotId}/${api.CAPACITY_URI}`,
    );
    expect(changeCapacityReq.request.method).toEqual('PATCH');
    expect(changeCapacityReq.request.body).toEqual({
      capacity,
      parkingLotId,
    });

    changeCapacityReq.flush({});
    httpTestingController.verify();
  });
});
