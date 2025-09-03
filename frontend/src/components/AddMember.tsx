import { AddMemberRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ApiError } from '../fetch/auth';
import { addMemberApi } from '../utils/api';

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
    addMemberMutation.mutate();
  };

  return (
    <>
      {/* //! the form can't handle the submission */}
      <form className="add-member">
        <label>{t('addMember.label')}</label>
        <input
          type="text"
          placeholder={t('addMember.placeholder')}
          value={newMem}
          onChange={e => setNewMem(e.target.value)}
        />
        <button type="submit" onClick={handleAddMember} disabled={addMemberMutation.isLoading}>
          {t('addMember.button')}
        </button>
      </form>
      {addMemberMutation.isSuccess && <p className="success">{t('addMember.success')}</p>}
      {addMemberMutation.isError && (
        <p className="error">{addMemberMutation.error?.message || t('addMember.error')}</p>
      )}
    </>
  );
};
