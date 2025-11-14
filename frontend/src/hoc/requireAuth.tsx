import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from 'src/fetch';
import { ROUTES } from 'src/utils/routes';

export const requireAuth = (Component: FC) => (props: any) =>
  isLoggedIn() ? <Component {...props} /> : <Navigate to={ROUTES.LOGIN} replace />;
