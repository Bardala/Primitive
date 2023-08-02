import { ENDPOINT, Space, SpaceRes, UpdateSpaceReq, UpdateSpaceRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';
import { useSpaceReducer } from '../hooks/spaceReducer';
import { SpaceForm } from './SpaceForm';

export const EditSpaceForm = () => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSpaceReducer();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { space }: { space: Space } = queryClient.getQueryData(['space', id]) as SpaceRes;

  const updateSpaceMutation = useMutation<UpdateSpaceRes, ApiError>(
    () =>
      fetchFn<UpdateSpaceReq, UpdateSpaceRes>(ENDPOINT.UPDATE_SPACE, 'PUT', state, currUser?.jwt, [
        id!,
      ]),
    {
      onError: () => console.error('error'),
      onSuccess: data => {
        dispatch({ type: 'SET_NAME', payload: '' });
        dispatch({ type: 'SET_STATUS', payload: 'public' });
        dispatch({ type: 'SET_DESCRIPTION', payload: '' });
        queryClient.invalidateQueries(['space', id]);
      },
    }
  );

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    updateSpaceMutation.mutate();
  };

  return (
    <>
      <SpaceForm
        handleSubmit={handleSubmit}
        isLoading={updateSpaceMutation.isLoading}
        dispatch={dispatch}
        state={state}
        initialSpace={space}
      />
      {updateSpaceMutation.isError && <p className="error">{updateSpaceMutation.error.message}</p>}
      {updateSpaceMutation.isSuccess && <p className="success">Space updated successfully</p>}
    </>
  );
};
