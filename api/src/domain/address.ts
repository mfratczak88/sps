import { Validate } from './validate.decorator';
import { IsNotEmpty } from 'class-validator';

@Validate
export class Address {
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  streetName: string;

  @IsNotEmpty()
  streetNumber: string;

  constructor(city: string, streetName: string, streetNumber: string) {
    this.city = city;
    this.streetName = streetName;
    this.streetNumber = streetNumber;
  }
}
