import { CreateSpaceRes } from '@nest/shared';
import { useMutation } from '@tanstack/react-query';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ApiError } from '../fetch/auth';
import { useSpaceReducer } from '../hooks/spaceReducer';
import { createSpcApi } from '../utils/api';
import { SpaceForm } from './SpaceForm';

export const CreateSpace = () => {
  const { state, dispatch } = useSpaceReducer();
  const nav = useNavigate();

  const createSpaceMutate = useMutation<CreateSpaceRes, ApiError>(createSpcApi(state), {
    onError: () => console.error('error'),
    onSuccess: data => {
      dispatch({ type: 'SET_NAME', payload: '' });
      dispatch({ type: 'SET_STATUS', payload: 'public' });
      dispatch({ type: 'SET_DESCRIPTION', payload: '' });
      nav(`/space/${data.space.id}`);
    },
  });

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createSpaceMutate.mutate();
  };

  return (
    <>
      {createSpaceMutate.isError && <p className="error">{createSpaceMutate.error.message}</p>}
      <SpaceForm
        handleSubmit={handleSubmit}
        isLoading={createSpaceMutate.isLoading}
        dispatch={dispatch}
        state={state}
      />
    </>
  );
};
