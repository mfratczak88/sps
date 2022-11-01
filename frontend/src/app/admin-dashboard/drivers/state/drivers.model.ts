export interface DriverDto {
  id: string;
  name: string;
  email: string;
  parkingLots: {
    id: string;
    city: string;
    streetName: string;
    streetNumber: string;
  }[];
}
export type Driver = DriverDto & {
  parkingLotCount: number;
};

export interface AssignDriverToParkingLot {
  driverId: string;
  parkingLotId: string;
}
