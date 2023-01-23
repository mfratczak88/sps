import { SpsReservationTimePipe } from './reservation-time';

describe('TimePipe', () => {
  it('create an instance', () => {
    const pipe = new SpsReservationTimePipe();
    expect(pipe).toBeTruthy();
  });
});
