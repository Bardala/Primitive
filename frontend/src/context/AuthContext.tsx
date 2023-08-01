import { LoginRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext, useContext } from 'react';

import { isLoggedIn } from '../fetch/auth';

type UserContext = {
  currUser?: LoginRes;
  refetchCurrUser: () => void;
};

export const AuthContext = createContext({} as UserContext);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // we will use useQuery instead of useReducer
  const { data: currUser, refetch: refetchCurrUser } = useQuery(
    ['getCurrUser'],
    () => {
      const currUser = JSON.parse(localStorage.getItem('currUser') || '{}');
      return currUser as LoginRes;
    },
    {
      enabled: isLoggedIn(),
      refetchOnWindowFocus: false,
      // onSuccess: (currUser) => console.log("currUser", currUser),
    }
  );

  return (
    <AuthContext.Provider value={{ currUser, refetchCurrUser }}>{children}</AuthContext.Provider>
  );
};
