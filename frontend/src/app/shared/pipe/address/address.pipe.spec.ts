import { AddressPipe } from './address.pipe';

describe('AddressPipe', () => {
  it('shows address in format: streetName streetNumber, city', () => {
    const address = new AddressPipe().transform({
      city: 'Toruń',
      streetNumber: '8a',
      streetName: 'Bażyńskich',
    });
    expect(address).toEqual('Bażyńskich 8a, Toruń');
  });
});
