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
        <input
          type="text"
          id="name"
          name="name"
          value={state.name}
          placeholder="space name"
          onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })}
        />

        <select
          placeholder="Status"
          name="status"
          id="status"
          value={state.status}
          onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value as SpaceStatus })}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <textarea
          placeholder="description"
          name="description"
          id="description"
          value={state.description}
          onChange={e => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
        />
        <button type="submit" disabled={isLoading}>
          Create
        </button>
      </form>
    </>
  );
};
