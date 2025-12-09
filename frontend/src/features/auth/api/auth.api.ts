import { postFn } from '@/core/services';

import {
  ENDPOINT,
  LoginReq,
  LoginRes,
  SignUpReq,
  UpdatePasswordReq,
  UpdatePasswordRes,
} from '@nest/shared';

export const AuthApi = {
  login: (login: string, password: string) =>
    postFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, { login, password }),

  signUp: (email: string, password: string, username: string) =>
    postFn<SignUpReq, LoginRes>(ENDPOINT.SIGNUP, { email, password, username }),

  updatePassword: (data: UpdatePasswordReq) =>
    postFn<UpdatePasswordReq, UpdatePasswordRes>(ENDPOINT.UPDATE_USER_PASSWORD, data),
};
