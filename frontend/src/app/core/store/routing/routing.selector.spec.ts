import {
  activationGuid,
  afterLoginUrl,
  driverId,
  emailFragment,
  pageQueryParam,
  pageSizeQueryParam,
  parkingLotId,
  previousActivationGuidQueryParam,
  queryParams,
  reservationId,
} from './routing.selector';
import { routerStateModel } from '../../../../../test/store.util';

describe('Routing selectors', () => {
  describe('Params', () => {
    it('Returns driverId param', () => {
      expect(driverId(routerStateModel({ driverId: '3' }))).toEqual('3');
    });
    it('Returns reservationId param', () => {
      expect(reservationId(routerStateModel({ reservationId: '2' }))).toEqual(
        '2',
      );
    });
    it('Returns parkingLotId param', () => {
      expect(parkingLotId(routerStateModel({ parkingLotId: '4' }))).toEqual(
        '4',
      );
    });
    it('Returns activationGuid param', () => {
      expect(
        activationGuid(routerStateModel({ activationGuid: '44-JH' })),
      ).toEqual('44-JH');
    });
  });
  describe('Query params', () => {
    it('Returns page query param', () => {
      expect(pageQueryParam(routerStateModel({}, { page: 4 }))).toEqual(4);
    });
    it('Returns pageSize query param', () => {
      expect(
        pageSizeQueryParam(routerStateModel({}, { pageSize: 50 })),
      ).toEqual(50);
    });
    it('Returns all query params', () => {
      expect(
        queryParams(routerStateModel({}, { foo: 'bar', baz: 'foo' })),
      ).toEqual({ foo: 'bar', baz: 'foo' });
    });
    it('Returns previousActivationGuid', () => {
      expect(
        previousActivationGuidQueryParam(
          routerStateModel({}, { previousActivationGuid: 'previous' }),
        ),
      ).toEqual('previous');
    });
  });
  describe('Fragment', () => {
    it('Returns true if fragment === email', () => {
      expect(emailFragment(routerStateModel({}, {}, 'email'))).toEqual(true);
    });
  });

  describe('Url after login', () => {
    it('Returns / if returnUrl query params is falsy', () => {
      expect(afterLoginUrl(routerStateModel({}, {}))).toEqual('/');
    });
    it('Returns return url together with other query params', () => {
      expect(
        afterLoginUrl(
          routerStateModel(
            {},
            {
              returnUrl: 'foo?bar=baz',
              paramA: 'paramAValue',
              paramB: 'paramBValue',
            },
          ),
        ),
      ).toEqual('foo?bar=baz&paramA=paramAValue&paramB=paramBValue');
    });
  });
});
