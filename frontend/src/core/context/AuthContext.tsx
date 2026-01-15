import { LoginRes } from '@nest/shared';

import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext, useContext, useEffect } from 'react';

import { isLoggedIn } from '../services';
import { connectSocket, disconnectSocket } from '../utils';
import { LOCALS } from '../utils/localStorage';

type UserContext = {
  currUser?: LoginRes;
  refetchCurrUser: () => void;
};

export const AuthContext = createContext({} as UserContext);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const key = ['getCurrUser'];
  const queryFn = () => {
    const currUser = JSON.parse(localStorage.getItem(LOCALS.CURR_USER) || '{}');
    return currUser as LoginRes;
  };

  const { data: currUser, refetch: refetchCurrUser } = useQuery(key, queryFn, {
    enabled: isLoggedIn(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (currUser?.jwt) {
      connectSocket(currUser.jwt);
    } else {
      disconnectSocket();
    }
  }, [currUser]);

  return (
    <AuthContext.Provider value={{ currUser, refetchCurrUser }}>{children}</AuthContext.Provider>
  );
};
