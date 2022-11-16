import { Injectable } from '@nestjs/common';
import { TimeKeeper } from '../../../domain/time/time-keeper';
import { MomentInTime } from '../../../domain/time/moment';
import {
  DateAndTimeInterval,
  TimeInterval,
} from '../../../domain/time/interval';
import { PrismaDateAndTime, PrismaTime } from './prisma.moment';
import { PrismaDateInterval, PrismaTimeInterval } from './prisma.interval';

@Injectable()
export class PrismaTimeKeeper implements TimeKeeper {
  dateAndTimeNow(): MomentInTime {
    return PrismaDateAndTime.now();
  }

  timeFromString(time: string): MomentInTime {
    return new PrismaTime(time);
  }

  timeNow(): MomentInTime {
    return PrismaTime.now();
  }

  newDateTimeInterval(start: string, end: string): DateAndTimeInterval {
    return new PrismaDateInterval(start, end);
  }

  newTimeInterval(start: string, end: string): TimeInterval {
    return new PrismaTimeInterval(start, end);
  }

  dateAndTimeFromString(dateAndTime: string): MomentInTime {
    return new PrismaDateAndTime(dateAndTime);
  }
}
