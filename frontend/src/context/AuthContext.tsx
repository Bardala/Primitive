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
      const token = JSON.parse(localStorage.getItem("token") || "");
      console.log("token", token);
      return token as LoginRes;
    },
  );

  return (
    <AuthContext.Provider value={{ currUser, refetchCurrUser }}>
      {children}
    </AuthContext.Provider>
  );
};
