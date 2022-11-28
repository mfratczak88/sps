import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ModuleRef } from '@nestjs/core';
import { ReservationAuthorizationService } from '../../../../../../src/infrastructure/security/authorization/reservation.authorization.service';
import { PolicyCheckContext } from '../../../../../../src/infrastructure/security/authorization/policy/policy.handler';
import { randomId } from '../../../../../misc.util';
import {
  CanCancelReservation,
  CanChangeTimeOfReservation,
  CanConfirmReservation,
  CanCreateReservation,
  CanIssueParkingTicket,
  CanReturnParkingTicket,
} from '../../../../../../src/infrastructure/security/authorization/policy/reservation.policy';

describe('Reservation policy', () => {
  let moduleRef: DeepMocked<ModuleRef>;
  let authorizationServiceMock: DeepMocked<ReservationAuthorizationService>;
  beforeEach(() => {
    moduleRef = createMock();
    authorizationServiceMock = createMock();
    moduleRef.get.mockReturnValue(authorizationServiceMock);
  });
  describe('Creating reservation', () => {
    it('Delegates the call to auth service providing userId', async () => {
      const userId = randomId();
      const context: PolicyCheckContext = {
        userId,
        moduleRef,
      };

      await new CanCreateReservation().handle(context);
      expect(
        authorizationServiceMock.canCreateReservation,
      ).toHaveBeenCalledWith(userId);
    });
  });
  describe('Time change', () => {
    it('Delegates the call to auth service providing userId and reservation Id', async () => {
      const userId = randomId();
      const reservationId = randomId();
      const context: PolicyCheckContext = {
        userId,
        moduleRef,
        command: {
          reservationId,
        },
      };
      await new CanChangeTimeOfReservation().handle(context);
      expect(
        authorizationServiceMock.canChangeTimeOfReservation,
      ).toHaveBeenCalledWith(userId, reservationId);
    });
  });
  describe('Confirmation a reservation', () => {
    it('Delegates the call to auth service providing userId and reservationId from param', async () => {
      const userId = randomId();
      const reservationId = randomId();
      const context: PolicyCheckContext = {
        userId,
        moduleRef,
        params: { id: reservationId },
      };

      await new CanConfirmReservation().handle(context);
      expect(
        authorizationServiceMock.canConfirmReservation,
      ).toHaveBeenCalledWith(userId, reservationId);
    });
  });
  describe('Canceling reservation', () => {
    it('Delegates the call to auth service providing userId and reservationId from param', async () => {
      const userId = randomId();
      const reservationId = randomId();
      const context: PolicyCheckContext = {
        userId,
        moduleRef,
        params: { id: reservationId },
      };

      await new CanCancelReservation().handle(context);
      expect(
        authorizationServiceMock.canCancelReservation,
      ).toHaveBeenCalledWith(userId, reservationId);
    });
  });
  describe('Issuing Ticket', () => {
    it('Delegates the call to auth service providing userId', async () => {
      const userId = randomId();
      const context: PolicyCheckContext = {
        userId,
        moduleRef,
      };

      await new CanIssueParkingTicket().handle(context);
      expect(
        authorizationServiceMock.canIssueParkingTicket,
      ).toHaveBeenCalledWith(userId);
    });
  });
  describe('Returning Ticket', () => {
    it('Delegates the call to auth service providing userId', async () => {
      const userId = randomId();
      const context: PolicyCheckContext = {
        userId,
        moduleRef,
      };

      await new CanReturnParkingTicket().handle(context);
      expect(
        authorizationServiceMock.canReturnParkingTicket,
      ).toHaveBeenCalledWith(userId);
    });
  });
});
