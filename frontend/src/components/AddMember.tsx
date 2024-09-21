import { AddMemberRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ApiError } from '../fetch/auth';
import { addMemberApi } from '../utils/api';

export const AddMember = () => {
  const { id } = useParams();
  const [newMem, setNewMem] = useState('');
  const queryClient = useQueryClient();
  const key = ['members', id];

  const addMemberMutation = useMutation<AddMemberRes, ApiError>(addMemberApi(newMem, false, id!), {
    onSuccess: data => {
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
        <label>Add member</label>
        <input
          type="text"
          placeholder="username or id"
          value={newMem}
          onChange={e => setNewMem(e.target.value)}
        />
        <button type="submit" onClick={handleAddMember} disabled={addMemberMutation.isLoading}>
          Add
        </button>
      </form>
      {addMemberMutation.isSuccess && <p className="success">new user is added</p>}
      {addMemberMutation.isError && <p className="error">{addMemberMutation.error.message}</p>}
    </>
  );
};
