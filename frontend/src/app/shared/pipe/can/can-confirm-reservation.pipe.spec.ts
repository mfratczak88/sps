import { CanConfirmReservationPipe } from './can-confirm-reservation.pipe';

describe('CanConfirmReservationPipe', () => {
  it('create an instance', () => {
    const pipe = new CanConfirmReservationPipe();
    expect(pipe).toBeTruthy();
  });
});
