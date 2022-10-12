import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import { Roles } from '../model/roles';

export const all = async (req: Request, res: Response) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).send({ users });
  } catch (err) {
    return handleError(err, res);
  }
};
export const get = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(err, res);
  }
};

export const patch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) {
    return res.status(400).send({ message: 'Missing role field' });
  }
  if (!Object.values(Roles).includes(role)) {
    return res.status(400).send({ message: 'Invalid role' });
  }
  await admin.auth().setCustomUserClaims(id, { role });
  const user = await admin.auth().getUser(id);

  return res.status(204).send({ user: mapUser(user) });
};
const mapUser = (user: admin.auth.UserRecord) => {
  const customClaims = (user.customClaims || { role: '' }) as { role?: string };
  const role = customClaims.role ? customClaims.role : '';
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
};

const handleError = (err: any, res: Response) => {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
};
