import { NextFunction, Request, Response } from 'express';
import { Roles } from '../model/roles';

export const isAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { role, email } = res.locals;
  if (email === 'mfratczak88@gmail.com') return next();

  if (!role) return res.status(403).send();

  if (role === Roles.ADMIN) return next();

  return res.status(403).send();
};
