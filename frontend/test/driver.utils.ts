import { OperationTimeDays } from '../src/app/core/model/common.model';
import { Driver } from '../src/app/core/model/driver.model';
import { ParkingLot } from '../src/app/core/model/parking-lot.model';

export const mockParkingLots: ParkingLot[] = [
  {
    id: '3',
    streetName: 'Sobieskiego',
    city: 'Warszawa',
    hourTo: 20,
    hourFrom: 12,
    streetNumber: '4',
    days: [OperationTimeDays.FRIDAY],
    validFrom: new Date(Date.now()),
    capacity: 400,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    streetName: 'Cybernetyki',
    city: 'Toruń',
    hourTo: 20,
    hourFrom: 12,
    streetNumber: '20',
    capacity: 100,
    days: [OperationTimeDays.FRIDAY],
    validFrom: new Date(Date.now()),
    createdAt: new Date().toISOString(),
  },
];
export const mockDriver: Driver = {
  id: '4',
  email: 'foo@gmail.com',
  name: 'Alex',
  parkingLotIds: ['1', '2'],
  vehicles: [{ licensePlate: 'WI747GG' }],
};
