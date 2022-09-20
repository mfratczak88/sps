import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  parking$: Observable<Parking[]>;

  constructor(private afs: AngularFirestore) {
    const parkingCollection = afs.collection<Parking>('parkings');
    this.parking$ = parkingCollection.valueChanges();
  }
}

interface Parking {
  name: string;
  address: {
    city: string;
    streetName: string;
    streetNumber: string;
  };
  capacity: number;
  operationHours: {
    timeFrom: number;
    timeTo: number;
  };
}
