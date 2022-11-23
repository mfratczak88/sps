import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ReservationService } from '../../../../src/application/reservation/reservation.service';
import { ReservationController } from '../../../../src/infrastructure/web/reservation.controller';
import {
  ChangeTimeCommand,
  CreateReservationCommand,
} from '../../../../src/application/reservation/reservation.command';
import { randomId } from '../../../misc.util';

describe('Reservation controller', () => {
  let reservationServiceMock: DeepMocked<ReservationService>;
  let reservationController: ReservationController;
  beforeEach(async () => {
    reservationServiceMock = createMock<ReservationService>();
    reservationController = new ReservationController(reservationServiceMock);
  });
  it('Delegates make reservation command to service', async () => {
    const command = createMock<CreateReservationCommand>();
    await reservationController.make(command);
    expect(reservationServiceMock.makeReservation).toHaveBeenCalledWith(
      command,
    );
  });
  it('Delegates cancel reservation command to service', async () => {
    const id = randomId();

    await reservationController.cancel(id);

    expect(reservationServiceMock.cancel).toHaveBeenCalledWith(id);
  });
  it('Delegates confirm reservation command to service', async () => {
    const id = randomId();

    await reservationController.confirm(id);

    expect(reservationServiceMock.confirm).toHaveBeenCalledWith(id);
  });
  it('Delegates change reservation hours command to service', async () => {
    const command: ChangeTimeCommand = {
      reservationId: randomId(),
      start: new Date(Date.now()),
      end: new Date(Date.now()),
    };
    const { reservationId } = command;

    await reservationController.changeTime(reservationId, command);
    expect(reservationServiceMock.changeTime).toHaveBeenCalledWith(command);
  });
  it('Delegates issue parking ticket command to service', async () => {
    const id = randomId();

    await reservationController.issueParkingTicket(id);

    expect(reservationServiceMock.issueParkingTicket).toHaveBeenCalledWith(id);
  });
  it('Delegates return parking ticket command to service', async () => {
    const id = randomId();

    await reservationController.returnParkingTicket(id);

    expect(reservationServiceMock.returnParkingTicket).toHaveBeenCalledWith(id);
  });
});
