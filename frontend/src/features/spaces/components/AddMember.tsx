import { ApiError } from '@/core/services';
import { addMemberApi } from '@/core/utils';

import { AddMemberRes } from '@nest/shared';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const AddMember = () => {
  const { id } = useParams();
  const [newMem, setNewMem] = useState('');
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const key = ['members', id];

  const addMemberMutation = useMutation<AddMemberRes, ApiError>(addMemberApi(newMem, false, id!), {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setNewMem('');
    },
  });

  const handleAddMember = (e: React.FormEvent | MouseEvent) => {
    e.preventDefault();
    if (!newMem.trim()) return;
    addMemberMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAddMember} className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
          {t('addMember.label')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t('addMember.placeholder')}
            value={newMem}
            onChange={e => setNewMem(e.target.value)}
            className="w-full rounded-xl border border-border-light bg-background-light px-4 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-border-dark dark:bg-background-dark dark:focus:border-primary-500/50"
          />
          <button
            type="submit"
            disabled={addMemberMutation.isLoading || !newMem.trim()}
            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 disabled:opacity-50"
          >
            {addMemberMutation.isLoading ? '...' : t('addMember.button')}
          </button>
        </div>
      </form>
      {addMemberMutation.isSuccess && (
        <p className="rounded-lg bg-green-50 p-2 text-sm font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400">
          {t('addMember.success')}
        </p>
      )}
      {addMemberMutation.isError && (
        <p className="rounded-lg bg-red-50 p-2 text-sm font-medium text-red-600 dark:bg-red-900/10 dark:text-red-400">
          {addMemberMutation.error?.message || t('addMember.error')}
        </p>
      )}
    </div>
  );
};
