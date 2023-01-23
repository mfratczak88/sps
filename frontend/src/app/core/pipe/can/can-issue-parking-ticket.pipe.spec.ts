import { CanIssueParkingTicketPipe } from './can-issue-parking-ticket.pipe';

describe('CanIssueParkingTicketPipe', () => {
  it('create an instance', () => {
    const pipe = new CanIssueParkingTicketPipe();
    expect(pipe).toBeTruthy();
  });
});
