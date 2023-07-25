import { isLoggedIn } from "../fetch/auth";
import { LoginRes } from "@nest/shared";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

type UserContext = {
  currUser?: LoginRes;
  refetchCurrUser: () => void;
};

export const AuthContext = createContext({} as UserContext);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // we will use useQuery instead of useReducer
  const { data: currUser, refetch: refetchCurrUser } = useQuery(
    ["getCurrUser"],
    () => {
      const currUser = JSON.parse(localStorage.getItem("currUser") || "{}");
      return currUser as LoginRes;
    },
    {
      enabled: isLoggedIn(),
      onSuccess: (currUser) => console.log("data", currUser),
    },
  );

  return (
    <AuthContext.Provider value={{ currUser, refetchCurrUser }}>
      {children}
    </AuthContext.Provider>
  );
};
