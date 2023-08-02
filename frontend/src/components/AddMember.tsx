import { AddMemberReq, AddMemberRes, ENDPOINT } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const AddMember = () => {
  const { id } = useParams();
  const [newMember, setNewMember] = useState('');
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation<AddMemberRes, ApiError>(
    () =>
      fetchFn<AddMemberReq, AddMemberRes>(
        ENDPOINT.ADD_MEMBER,
        'POST',
        { member: newMember, isAdmin: false },
        currUser?.jwt,
        [id!]
      ),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['members', id]);
        setNewMember('');
        console.log('newUser', data);
        console.log('new member added');
      },
      onError: err => console.error(err),
    }
  );

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
          value={newMember}
          onChange={e => setNewMember(e.target.value)}
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
