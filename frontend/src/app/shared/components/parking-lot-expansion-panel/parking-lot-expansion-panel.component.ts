import { Component, Input } from '@angular/core';
import { ParkingLotBaseModel } from '../../../core/model/parking-lot.model';

@Component({
  selector: 'sps-parking-lot-expansion-panel',
  templateUrl: './parking-lot-expansion-panel.component.html',
  styleUrls: ['./parking-lot-expansion-panel.component.scss'],
})
export class ParkingLotExpansionPanelComponent {
  opened = false;

  @Input()
  parkingLot: ParkingLotBaseModel;
}
