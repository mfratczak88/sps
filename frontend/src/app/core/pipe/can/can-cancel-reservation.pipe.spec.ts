import { CanCancelReservationPipe } from './can-cancel-reservation.pipe';

describe('CanCancelReservationPipe', () => {
  it('create an instance', () => {
    const pipe = new CanCancelReservationPipe();
    expect(pipe).toBeTruthy();
  });
});
