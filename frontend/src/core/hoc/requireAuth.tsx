import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { isLoggedIn } from '../services';
import { ROUTES } from '../utils';

export const requireAuth = (Component: FC) => (props: any) =>
  isLoggedIn() ? <Component {...props} /> : <Navigate to={ROUTES.LOGIN} replace />;
