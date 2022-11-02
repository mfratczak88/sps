export interface ParkingLot {
  id: string;
  createdAt: string;
  city: string;
  streetName: string;
  streetNumber: string;
  capacity: number;
  hourFrom: string;
  hourTo: string;
}
export interface ChangeHoursOfOperations {
  hourFrom: string;
  hourTo: string;
}
export interface CreateParkingLot {
  capacity: number;
  hoursOfOperation: {
    hourFrom: string;
    hourTo: string;
  };
  address: {
    city: string;
    streetName: string;
    streetNumber: string;
  };
}
export interface Address {
  city: string;
  streetName: string;
  streetNumber: string;
}
