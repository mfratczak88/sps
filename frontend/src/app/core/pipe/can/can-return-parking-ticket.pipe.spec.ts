import { CanReturnParkingTicketPipe } from './can-return-parking-ticket.pipe';

describe('CanReturnParkingTicketPipe', () => {
  it('create an instance', () => {
    const pipe = new CanReturnParkingTicketPipe();
    expect(pipe).toBeTruthy();
  });
});
