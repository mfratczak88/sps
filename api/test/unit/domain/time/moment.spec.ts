import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';
import { MomentInTime } from '../../../../src/domain/time/moment';
import { DateTime } from 'luxon';
import { wait } from '../../../misc.util';

describe('Moment in time', () => {
  it('Throws exception on construction when date is invalid', () => {
    try {
      new MomentInTime(new Date('foo'));
      fail();
    } catch (e) {
      expect((e as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_MOMENT_IN_TIME,
      );
    }
  });
  it('isBefore returns true if difference between moments is positive number', async () => {
    const dateBefore = MomentInTime.now();
    await wait(100);

    const dateNow = MomentInTime.now();

    expect(dateBefore.isBefore(dateNow)).toEqual(true);
    expect(dateNow.isBefore(dateBefore)).toEqual(false);
  });
  it('hour is full when minute, second and millisecond = 0', () => {
    const fullHourMoment = new MomentInTime(
      new Date(Date.UTC(2020, 12, 12, 10, 0, 0)),
    );

    expect(fullHourMoment.isFullHour()).toEqual(true);
  });
  it('Now with full hours returns date with current hour but minute, second and millisecond = 0', () => {
    const momentInTime = MomentInTime.nowWithFullHour();

    const jsDate = momentInTime.jsDate();

    expect(jsDate.getMinutes()).toEqual(0);
    expect(jsDate.getMilliseconds()).toEqual(0);
    expect(jsDate.getSeconds()).toEqual(0);
  });

  it('provides minutes difference between two dates', () => {
    const momentA = new MomentInTime(
      new Date(Date.UTC(2020, 12, 12, 10, 0, 0)),
    );
    const momentB = new MomentInTime(
      new Date(Date.UTC(2020, 12, 12, 10, 30, 0)),
    );
    expect(momentA.minutesDiff(momentB)).toEqual(-30);
    expect(momentB.minutesDiff(momentA)).toEqual(30);
  });
});
