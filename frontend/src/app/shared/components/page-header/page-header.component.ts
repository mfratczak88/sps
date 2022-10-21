import { Component, Input } from '@angular/core';

@Component({
  selector: 'sps-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input()
  title: string;

  @Input()
  subTitle: string;
}
