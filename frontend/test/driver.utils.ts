import { Driver } from '../src/app/admin-dashboard/drivers/state/drivers.model';

export const mockParkingLots = [
  {
    id: '3',
    streetName: 'Sobieskiego',
    city: 'Warszawa',
    hourTo: '20:00',
    hourFrom: '12:00',
    streetNumber: '4',
    capacity: 400,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    streetName: 'Cybernetyki',
    city: 'Toruń',
    hourTo: '20:00',
    hourFrom: '12:00',
    streetNumber: '20',
    capacity: 100,
    createdAt: new Date().toISOString(),
  },
];
export const mockDriver: Driver = {
  id: '4',
  email: 'foo@gmail.com',
  name: 'Alex',
  parkingLots: [],
  parkingLotCount: 0,
};
