import { Id } from '../../domain/id';
import { ReservationStatus } from '../../domain/reservation/reservation-status';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export interface ReservationsReadModel {
  data: ReservationReadModel[];
  page: number;
  pageSize: number;
  count: number;
}

export interface ReservationReadModel {
  id: Id;
  parkingLotId: Id;
  status: ReservationStatus;
  startTime: Date;
  endTime: Date;
  date: Date;
  licensePlate: string;
  city: string;
  streetName: string;
  streetNumber: string;
  approvalTimeStart?: Date;
  approvalDeadLine?: Date;
  parkingTickets: ParkingTicket[];
}

export interface ParkingTicket {
  timeOfEntry: Date;
  timeOfLeave?: Date;
  validTo: Date;
}

const enumValues = (e: unknown) => Object.values(e);

export enum SortBy {
  STATUS = 'status',
  PARKING_LOT = 'parkingLot',
  DATE = 'date',
}

export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export class ReservationQuery {
  @IsOptional()
  @IsString()
  driverId?: Id;

  @IsOptional()
  @IsIn(enumValues(ReservationStatus))
  status?: ReservationStatus;

  @IsOptional()
  @IsString()
  parkingLotId?: Id;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(50)
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsIn(enumValues(SortBy))
  sortBy?: SortBy;

  @IsOptional()
  @IsIn(enumValues(SortOrder))
  sortOrder?: SortOrder;
}
