import { MomentInTime } from '../../../../src/domain/time/moment';
import { wait } from '../../../misc.util';
import { PeriodOfTime } from '../../../../src/domain/time/period';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';

describe('Period of time', () => {
  it('Throws domain exception when given start and end date doesnt create an interval', async () => {
    const now = MomentInTime.now();
    await wait(100);
    const after100Milliseconds = MomentInTime.now();

    try {
      new PeriodOfTime(after100Milliseconds.jsDate(), now.jsDate());
      fail();
    } catch (e) {
      expect((e as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_TIME_PERIOD,
      );
    }
  });
  it('equals other when its start and end are equal', () => {
    const start = new Date(Date.UTC(2020, 10, 1, 10, 30));
    const end = new Date(Date.UTC(2020, 10, 1, 10, 45));
    expect(new PeriodOfTime(start, end).equal(start, end)).toEqual(true);
  });
  it('has same days returns true if days are the same', () => {
    const start = new Date(Date.UTC(2020, 10, 1, 10, 30));
    const end = new Date(Date.UTC(2020, 10, 1, 10, 45));
    expect(new PeriodOfTime(start, end).hasSameDays()).toEqual(true);
  });
  it('is in the past when start date is before now', () => {
    const start = new Date(Date.UTC(2020, 10, 1, 10, 30));
    const end = new Date(Date.UTC(2030, 10, 1, 10, 30));
    expect(new PeriodOfTime(start, end).inThePast()).toEqual(true);
  });
});
