import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, interval, Observable, takeWhile } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
  selector: 'sps-time-left',
  templateUrl: './time-left.component.html',
  styleUrls: ['./time-left.component.scss'],
})
export class TimeLeftComponent implements OnInit {
  @Input()
  deadLine: Date | string;

  @Input()
  caption: string;

  @Output()
  timeIsUp = new EventEmitter<void>();

  time$: Observable<TimeLeft>;

  ngOnInit(): void {
    this.time$ = interval(1000).pipe(
      map(() => {
        const deadLineDateTime =
          typeof this.deadLine === 'string'
            ? DateTime.fromISO(this.deadLine)
            : DateTime.fromJSDate(this.deadLine);
        return deadLineDateTime.diffNow(['hours', 'minutes', 'seconds']);
      }),
      takeWhile(duration => duration.as('seconds') > 0),
      finalize(() => this.timeIsUp.next()),
    );
  }
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}
