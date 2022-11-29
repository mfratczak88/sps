import { WeekDays, WeekDaysShort } from '../translation-keys';

export interface ParkingLotAdminModel extends ParkingLotBaseModel {
  createdAt: string;
  capacity: number;
  validFrom: Date;
}

export interface ParkingLotBaseModel {
  id: string;
  city: string;
  streetName: string;
  streetNumber: string;
  hourFrom: number;
  hourTo: number;
  days: OperationTimeDays[];
}
export enum OperationTimeDays {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export const DayToTranslation = {
  [OperationTimeDays.MONDAY]: WeekDays.MONDAY,
  [OperationTimeDays.TUESDAY]: WeekDays.TUESDAY,
  [OperationTimeDays.WEDNESDAY]: WeekDays.WEDNESDAY,
  [OperationTimeDays.THURSDAY]: WeekDays.THURSDAY,
  [OperationTimeDays.FRIDAY]: WeekDays.FRIDAY,
  [OperationTimeDays.SATURDAY]: WeekDays.SATURDAY,
  [OperationTimeDays.SUNDAY]: WeekDays.SUNDAY,
};
export const DayToShortTranslation = {
  [OperationTimeDays.MONDAY]: WeekDaysShort.MONDAY,
  [OperationTimeDays.TUESDAY]: WeekDaysShort.TUESDAY,
  [OperationTimeDays.WEDNESDAY]: WeekDaysShort.WEDNESDAY,
  [OperationTimeDays.THURSDAY]: WeekDaysShort.THURSDAY,
  [OperationTimeDays.FRIDAY]: WeekDaysShort.FRIDAY,
  [OperationTimeDays.SATURDAY]: WeekDaysShort.SATURDAY,
  [OperationTimeDays.SUNDAY]: WeekDaysShort.SUNDAY,
};

export interface HoursOfOperation {
  hourFrom: number;
  hourTo: number;
}

export type ChangeHoursOfOperations = HoursOfOperation;

export interface CreateParkingLot {
  capacity: number;
  hoursOfOperation: {
    hourFrom: number;
    hourTo: number;
    validFrom: Date;
    days: OperationTimeDays[];
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
