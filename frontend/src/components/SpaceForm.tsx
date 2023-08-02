import { CreateSpaceReq, Space, SpaceStatus, UpdateSpaceReq } from '@nest/shared';
import { FormEventHandler } from 'react';

export const SpaceForm: React.FC<{
  handleSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  dispatch: any;
  state: CreateSpaceReq | UpdateSpaceReq;
  initialSpace?: Space;
}> = ({ handleSubmit, isLoading, dispatch, state, initialSpace }) => {
  return (
    <>
      <form className="create-space-from" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={state.name || initialSpace?.name}
          onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })}
        />

        <label htmlFor="status">Status</label>
        <select
          name="status"
          id="status"
          value={state.status || initialSpace?.status}
          onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value as SpaceStatus })}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={state.description || initialSpace?.description}
          onChange={e => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
        />
        <button type="submit" disabled={isLoading}>
          Create
        </button>
      </form>
    </>
  );
};
