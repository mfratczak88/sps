import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ReservationRepository } from '../../../../src/domain/reservation/reservation.repository';
import { Reservation } from '../../../../src/domain/reservation/reservation';
import { IdGenerator } from '../../../../src/domain/id';
import { ParkingLotAvailability } from '../../../../src/domain/parking-lot-availability';
import { ReservationService } from '../../../../src/application/reservation/reservation.service';
import { randomId } from '../../../misc.util';
import {
  ChangeTimeCommand,
  CreateReservationCommand,
} from '../../../../src/application/reservation/reservation.command';

describe('Reservation service', () => {
  let reservationRepoMock: DeepMocked<ReservationRepository>;
  let idGeneratorMock: DeepMocked<IdGenerator>;
  let availabilityMock: DeepMocked<ParkingLotAvailability>;
  let service: ReservationService;
  beforeEach(async () => {
    reservationRepoMock = createMock<ReservationRepository>();
    idGeneratorMock = createMock<IdGenerator>();
    availabilityMock = createMock<ParkingLotAvailability>();
    service = new ReservationService(
      reservationRepoMock,
      idGeneratorMock,
      availabilityMock,
    );
  });
  it('makes reservation calling factory and saving it to the repository', async () => {
    const reservationId = randomId();
    const parkingLotId = randomId();
    idGeneratorMock.generate.mockResolvedValue(reservationId);
    availabilityMock.placeInLotAvailable.mockResolvedValue(true);
    const command: CreateReservationCommand = {
      parkingLotId,
      start: new Date(Date.UTC(2023, 10, 10, 10)),
      end: new Date(Date.UTC(2023, 10, 10, 13)),
      licensePlate: 'WI747GK',
    };

    await service.makeReservation(command);

    const [reservation] = reservationRepoMock.save.mock.lastCall;
    const { id, parkingLotId: lotId, licensePlate } = reservation.plain();
    expect(id).toEqual(reservationId);
    expect(lotId).toEqual(parkingLotId);
    expect(licensePlate).toEqual('WI747GK');
  });
  it('fetch reservation, calls confirm and saves it in the repository', async () => {
    const reservationId = randomId();
    idGeneratorMock.generate.mockResolvedValue(reservationId);
    const mockReservation = createMock<Reservation>();
    reservationRepoMock.findByIdOrThrow.mockImplementation(
      async (id) => id === reservationId && mockReservation,
    );

    await service.confirm(reservationId);

    expect(mockReservation.confirm).toHaveBeenCalled();
    expect(reservationRepoMock.save).toHaveBeenCalledWith(mockReservation);
  });
  it('fetch reservation, calls cancel and saves it in the repository', async () => {
    const reservationId = randomId();
    idGeneratorMock.generate.mockResolvedValue(reservationId);
    const mockReservation = createMock<Reservation>();
    reservationRepoMock.findByIdOrThrow.mockImplementation(
      async (id) => id === reservationId && mockReservation,
    );

    await service.cancel(reservationId);

    expect(mockReservation.cancel).toHaveBeenCalled();
    expect(reservationRepoMock.save).toHaveBeenCalledWith(mockReservation);
  });
  it('fetch reservation, calls changeTime and saves it in the repository', async () => {
    const reservationId = randomId();
    idGeneratorMock.generate.mockResolvedValue(reservationId);
    const mockReservation = createMock<Reservation>();
    reservationRepoMock.findByIdOrThrow.mockImplementation(
      async (id) => id === reservationId && mockReservation,
    );
    const command: ChangeTimeCommand = {
      start: new Date(Date.UTC(2023, 10, 10, 10)),
      end: new Date(Date.UTC(2023, 10, 10, 10)),
      reservationId,
    };
    await service.changeTime(command);

    expect(mockReservation.changeTime).toHaveBeenCalledWith(
      { start: command.start, end: command.end },
      availabilityMock,
    );
    expect(reservationRepoMock.save).toHaveBeenCalledWith(mockReservation);
  });
  it('fetch reservation, call issueParkingTicket and save it in the repository', async () => {
    const reservationId = randomId();
    idGeneratorMock.generate.mockResolvedValue(reservationId);
    const mockReservation = createMock<Reservation>();
    reservationRepoMock.findByIdOrThrow.mockImplementation(
      async (id) => id === reservationId && mockReservation,
    );

    await service.issueParkingTicket(reservationId);

    expect(mockReservation.issueParkingTicket).toHaveBeenCalled();
    expect(reservationRepoMock.save).toHaveBeenCalledWith(mockReservation);
  });
  it('fetch reservation, call returnParkingTicket and save it in the repository', async () => {
    const reservationId = randomId();
    idGeneratorMock.generate.mockResolvedValue(reservationId);
    const mockReservation = createMock<Reservation>();
    reservationRepoMock.findByIdOrThrow.mockImplementation(
      async (id) => id === reservationId && mockReservation,
    );

    await service.returnParkingTicket(reservationId);

    expect(mockReservation.returnParkingTicket).toHaveBeenCalled();
    expect(reservationRepoMock.save).toHaveBeenCalledWith(mockReservation);
  });
});
