import { isLoggedIn, loading, user, userId, userRole } from './auth.selector';
import { Role } from '../../model/auth.model';
import { defaults } from './auth.state';

describe('Auth selector', () => {
  describe('User role', () => {
    it('takes out role from state', () => {
      expect(userRole({ role: Role.DRIVER })).toEqual(Role.DRIVER);
    });
  });
  describe('User id', () => {
    it('takes out id from state', () => {
      expect(userId({ id: '3' })).toEqual('3');
    });
  });
  describe('Logged in', () => {
    it('Returns false if state is falsy', () => {
      expect(isLoggedIn(undefined)).toEqual(false);
    });
    it('Returns false if state = defaults', () => {
      expect(isLoggedIn(defaults)).toEqual(false);
    });
    it('Returns true if state is not falsy & not equals to defaults', () => {
      expect(isLoggedIn({ ...defaults, id: '3' })).toEqual(true);
    });
  });
  describe('User', () => {
    it('Passes over state', () => {
      expect(user({ ...defaults, id: '3' })).toEqual({
        ...defaults,
        id: '3',
      });
    });
  });
  describe('Loading', () => {
    it('takes out loading from state', () => {
      expect(loading({ ...defaults, loading: false })).toEqual(false);
    });
  });
});
