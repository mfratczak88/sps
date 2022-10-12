import { Application } from 'express';
import { all, get, patch } from './controller/users.controller';
import { isAuthorized } from './auth/authorized';
import { isAuthenticated } from './auth/authenticated';

const requiredAuthPreconditions = [isAuthenticated, isAuthorized];

export function routesConfig(app: Application) {
  app.get('/users', [...requiredAuthPreconditions, all]);
  app.get('/users/:id', [...requiredAuthPreconditions, get]);
  app.patch('/users/:id', [...requiredAuthPreconditions, patch]);
}
