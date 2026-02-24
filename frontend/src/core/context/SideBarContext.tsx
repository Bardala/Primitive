import { SideBarAction, useSideBarReducer } from '@/core/hooks/sideBarReducer';

import React, { ReactNode, createContext, useContext } from 'react';

interface SideBarContextType {
  state: any; // Using any for now to match the reducer's state, but we could type it better
  dispatch: React.Dispatch<SideBarAction>;
}

const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

export const SideBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useSideBarReducer();

  return <SideBarContext.Provider value={{ state, dispatch }}>{children}</SideBarContext.Provider>;
};

export const useSideBar = () => {
  const context = useContext(SideBarContext);
  if (context === undefined) {
    throw new Error('useSideBar must be used within a SideBarProvider');
  }
  return context;
};
