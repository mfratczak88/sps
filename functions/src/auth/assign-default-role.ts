import { auth } from 'firebase-admin';
import { ADMIN_USER_EMAIL } from './admin-user';
import { Roles } from '../model/roles';
import UserRecord = auth.UserRecord;

export const assignDefaultRole = (user: UserRecord) => {
  const { uid } = user;
  const role = user.email === ADMIN_USER_EMAIL ? Roles.ADMIN : Roles.DRIVER;
  return auth().setCustomUserClaims(uid, { role });
};
