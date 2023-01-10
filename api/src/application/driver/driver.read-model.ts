import { Id } from '../../domain/id';
import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { ReservationReadModel } from '../reservation/reservation.read-model';
import { Transform } from 'class-transformer';

export enum TimeHorizon {
  ONGOING = 'ongoing',
  DUE_NEXT = 'dueNext',
  PENDING_ACTION = 'pendingAction',
}

export interface DriverReadModel {
  id: Id;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: {
    licensePlate: string;
  }[];
  timeHorizon?: {
    dueNext?: ReservationReadModel[];
    ongoing?: ReservationReadModel[];
    pendingAction?: ReservationReadModel[];
  };
}

export class DriverQuery {
  @IsOptional()
  @ArrayMinSize(1)
  @IsArray()
  @Transform(({ value }) => value.split(','))
  timeHorizon?: TimeHorizon[];
}
