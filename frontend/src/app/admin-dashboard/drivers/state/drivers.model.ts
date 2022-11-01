export interface Driver {
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
