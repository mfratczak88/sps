import { HoursPipe } from './hours.pipe';

describe('HoursPipe', () => {
  it('shows hours with hyphen between', () => {
    const hours = new HoursPipe().transform({ hourFrom: 9, hourTo: 17 });
    expect(hours).toEqual('9 - 17');
  });
});
