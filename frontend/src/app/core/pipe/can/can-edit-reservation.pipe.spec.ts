import { CanEditReservationPipe } from './can-edit-reservation.pipe';

describe('CanEditReservationPipe', () => {
  it('create an instance', () => {
    const pipe = new CanEditReservationPipe();
    expect(pipe).toBeTruthy();
  });
});
