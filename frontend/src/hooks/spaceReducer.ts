import { CreateSpaceReq, UpdateSpaceReq } from '@nest/shared';
import { Dispatch, useReducer } from 'react';

type SpaceAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string };

export const useSpaceReducer = () => {
  const spaceReducer = (state: CreateSpaceReq | UpdateSpaceReq, action: SpaceAction) => {
    switch (action.type) {
      case 'SET_NAME':
        return { ...state, name: action.payload };
      case 'SET_STATUS':
        return { ...state, status: action.payload };
      case 'SET_DESCRIPTION':
        return { ...state, description: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch]: [CreateSpaceReq | UpdateSpaceReq, Dispatch<SpaceAction>] = useReducer(
    spaceReducer,
    {
      name: '',
      status: 'public',
      description: '',
    } as never
  );

  return { state, dispatch };
};
