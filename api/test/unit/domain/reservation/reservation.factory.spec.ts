import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { DomainException } from '../../../../src/domain/domain.exception';
import { IdGenerator } from '../../../../src/domain/id';
import { ParkingLotAvailability } from '../../../../src/domain/parking-lot-availability';
import { ReservationStatus } from '../../../../src/domain/reservation/reservation-status';
import { ReservationFactory } from '../../../../src/domain/reservation/reservation.factory';
import { MessageCode } from '../../../../src/message';
import { PrismaIdGenerator } from '../../../../src/persistence/prisma/prisma.id.generator';
import { randomId } from '../../../misc.util';

describe('Reservation factory', () => {
  let availabilityMock: DeepMocked<ParkingLotAvailability>;
  let idGenerator: DeepMocked<IdGenerator>;
  let factory: ReservationFactory;
  beforeEach(() => {
    availabilityMock = createMock<ParkingLotAvailability>();
    idGenerator = createMock<PrismaIdGenerator>();
    factory = new ReservationFactory(availabilityMock, idGenerator);
  });

  it('Throws exception when place in lot is not available', async () => {
    availabilityMock.placeInLotAvailable.mockResolvedValue(false);
    try {
      await factory.newReservation({
        licensePlate: 'WI746XT',
        start: new Date(Date.now()),
        end: new Date(Date.now()),
        parkingLotId: randomId(),
      });
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.NO_PLACE_IN_LOT,
      );
    }
  });
  it('Creates new reservation in draft status, with no tickets', async () => {
    const id = randomId();
    idGenerator.generate.mockResolvedValue(id);
    const parkingLotId = randomId();
    const licensePlate = 'WI746WXC';
    const start = new Date(Date.UTC(2022, 12, 12, 10, 0));
    const end = new Date(Date.UTC(2022, 12, 12, 11, 0));

    const reservation = await factory.newReservation({
      licensePlate,
      parkingLotId,
      start,
      end,
    });

    expect(reservation.plain()).toEqual({
      id,
      status: ReservationStatus.DRAFT,
      parkingLotId: parkingLotId,
      licensePlate,
      parkingTickets: [],
      scheduledParkingTime: {
        start,
        end,
      },
    });
  });
});
