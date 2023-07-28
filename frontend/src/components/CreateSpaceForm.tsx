import { CreateSpaceReq, CreateSpaceRes, HOST, SpaceStatus } from '@nest/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { ApiError, fetchFn } from '../fetch/auth';

export const CreateSpaceForm = () => {
  const { currUser } = useAuthContext();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<SpaceStatus>('public');
  const [description, setDescription] = useState('');
  // const nav = useNavigate();

  const createSpaceMutate = useMutation<CreateSpaceRes, ApiError>(
    () =>
      fetchFn<CreateSpaceReq, CreateSpaceRes>(
        `${HOST}/space`,
        'POST',
        {
          name,
          status,
          description,
        },
        currUser?.jwt
      ),
    {
      onError: () => console.error('error'),
      // onSuccess: () => nav('/u/currUser?.id'),
    }
  );

  return (
    <>
      {createSpaceMutate.isSuccess && <p>Space created successfully</p>}
      {createSpaceMutate.isError && <p>{createSpaceMutate.error.message}</p>}
      <form className="create-space-from" onSubmit={() => createSpaceMutate.mutate()}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label htmlFor="status">Status</label>
        <select
          name="status"
          id="status"
          value={status}
          onChange={e => setStatus(e.target.value as SpaceStatus)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit" disabled={createSpaceMutate.isLoading}>
          Create
        </button>
      </form>
    </>
  );
};
