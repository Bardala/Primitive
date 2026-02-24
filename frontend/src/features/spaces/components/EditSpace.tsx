import { ApiError } from '@/core/services';
import { updateSpcApi } from '@/core/utils';

import { Space, SpaceRes, UpdateSpaceRes } from '@nest/shared';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useSpaceReducer } from '../hooks/spaceReducer';
import { SpaceForm } from './SpaceForm';

export const EditSpaceForm = () => {
  const { state, dispatch } = useSpaceReducer();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { space }: { space: Space } = queryClient.getQueryData(['space', id]) as SpaceRes;

  const updateSpaceMutation = useMutation<UpdateSpaceRes, ApiError>(updateSpcApi(state, id!), {
    onError: () => console.error('error'),
    onSuccess: () => {
      dispatch({ type: 'SET_NAME', payload: '' });
      dispatch({ type: 'SET_STATUS', payload: 'public' });
      dispatch({ type: 'SET_DESCRIPTION', payload: '' });
      queryClient.invalidateQueries(['space', id]);
    },
  });

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
      {updateSpaceMutation.isError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {updateSpaceMutation.error.message}
        </p>
      )}
      {updateSpaceMutation.isSuccess && (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-600 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">
          {t('editSpace.success')}
        </p>
      )}
    </>
  );
};
