import { HourPipe } from './hour.pipe';

describe('HourPipe', () => {
  it('shows hour with zero minutes', () => {
    const hour = new HourPipe().transform(11);
    expect(hour).toEqual('11:00');
  });
  it('adds leading zero to hours < 10', () => {
    const hour = new HourPipe().transform(8);
    expect(hour).toEqual('08:00');
  });
});
