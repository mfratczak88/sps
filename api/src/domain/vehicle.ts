import { Validate } from './validate.decorator';
import { IsNotEmpty } from 'class-validator';

@Validate
export class Vehicle {
  @IsNotEmpty()
  readonly licensePlate: string;

  constructor(licensePlate: string) {
    this.licensePlate = licensePlate;
  }
}
