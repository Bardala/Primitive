import { CreateSpaceReq, CreateSpaceRes, HOST, SpaceStatus } from '@nest/shared';
import { FormEvent, useState } from 'react';

import { fetchFn } from '../fetch/auth';

export const CreateSpaceForm = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<SpaceStatus>('public');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    await fetchFn<CreateSpaceReq, CreateSpaceRes>(`${HOST}/space`, 'post', {
      name,
      status,
      description,
    });
  };

  return (
    <>
      <form className="create-space-from">
        <label htmlFor="name" onSubmit={e => handleSubmit(e)}>
          Name
        </label>
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
        <button type="submit">Create</button>
      </form>
    </>
  );
};
