import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DriversApi } from './drivers.api';
import { mockDriver } from '../../../../../test/driver.utils';
import {
  AssignDriverToParkingLot,
  DriverDto,
  RemoveParkingLotAssignment,
} from './drivers.model';

describe('Drivers api spec', () => {
  let httpTestingController: HttpTestingController;
  let api: DriversApi;
  beforeEach(() => {
    const moduleRef = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DriversApi],
    });
    api = moduleRef.inject(DriversApi);
    httpTestingController = moduleRef.inject(HttpTestingController);
  });
  it('Get all calls api with base url', async () => {
    const driversDto: DriverDto[] = [mockDriver];
    api.getAll().subscribe(d => expect(d).toEqual(driversDto));
    const req = httpTestingController.expectOne(api.BASE_URL);
    expect(req.request.method).toEqual('GET');
    req.flush(driversDto);
    httpTestingController.verify();
  });
  it('Assign parking lot - calls POST req with csrf token', async () => {
    const request: AssignDriverToParkingLot = {
      driverId: '4',
      parkingLotId: '4',
    };
    api.assignParkingLot(request).subscribe();

    // CSRF Token
    const csrfReq = httpTestingController.expectOne(api.CSRF_TOKEN_URL);
    expect(csrfReq.request.method).toEqual('GET');
    csrfReq.flush({ csrfToken: '442' });

    // Actual Call
    const assignReq = httpTestingController.expectOne(
      `${api.BASE_URL}/4/${api.PARKING_LOTS_URI}`,
    );
    expect(assignReq.request.method).toEqual('POST');
    expect(assignReq.request.body).toEqual(request);
    httpTestingController.verify();
  });
  it('Remove parking lot - sends DELETE req with csrf token', async () => {
    const request: RemoveParkingLotAssignment = {
      driverId: '11',
      parkingLotId: '14883',
    };
    api.removeParkingLotAssignment(request).subscribe();

    // CSRF Token
    const csrfReq = httpTestingController.expectOne(api.CSRF_TOKEN_URL);
    expect(csrfReq.request.method).toEqual('GET');
    csrfReq.flush({ csrfToken: '12344' });

    // Actual Call
    const assignReq = httpTestingController.expectOne(
      `${api.BASE_URL}/${request.driverId}/${api.PARKING_LOTS_URI}/${request.parkingLotId}`,
    );
    expect(assignReq.request.method).toEqual('DELETE');
    expect(assignReq.request.body).toBeFalsy();
    httpTestingController.verify();
  });
});
