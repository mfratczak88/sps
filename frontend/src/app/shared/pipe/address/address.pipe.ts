import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address',
})
@Injectable({
  providedIn: 'root',
})
export class AddressPipe implements PipeTransform {
  transform(address: {
    city?: string;
    streetName?: string;
    streetNumber?: string;
  }): string {
    const { city, streetName, streetNumber } = address;
    return `${streetName} ${streetNumber}, ${city}`;
  }
}
