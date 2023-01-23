import { loading, roles, users } from './users.selector';
import { Role } from '../../../core/model/auth.model';
import { mapToObjectWithIds } from '../../../core/util';
import { mockUsers } from '../../../../../test/users.util';

describe('Users selector', () => {
  describe('roles', () => {
    it('takes out role from state model', () => {
      expect(
        roles({
          entities: {},
          loading: false,
          roles: [{ role: Role.DRIVER, translation: 'driver' }],
        }),
      ).toEqual([{ role: Role.DRIVER, translation: 'driver' }]);
    });
  });
  describe('users', () => {
    it('takes out users from model and returns them as array', () => {
      expect(
        users({
          entities: mapToObjectWithIds(mockUsers),
          loading: false,
          roles: [],
        }),
      ).toEqual(mockUsers);
    });
  });
  describe('loading', () => {
    it('takes out loading from state model', () => {
      expect(
        loading({
          entities: {},
          loading: true,
          roles: [],
        }),
      ).toEqual(true);
    });
  });
});
