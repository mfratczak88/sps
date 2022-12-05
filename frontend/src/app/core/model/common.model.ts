import { WeekDays, WeekDaysShort } from '../translation-keys';

export enum OperationTimeDays {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}
export type Id = string;

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
