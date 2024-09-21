import { LeaveSpaceRes } from '@nest/shared';
import { useMutation } from '@tanstack/react-query';
import { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ApiError } from '../fetch/auth';
import { SideBarAction } from '../hooks/sideBarReducer';
import { leaveSpcApi } from '../utils/api';

export const LeaveSpc: FC<{ spaceId: string; dispatch: React.Dispatch<SideBarAction> }> = ({
  spaceId,
  dispatch,
}) => {
  const nav = useNavigate();

  const leaveSpc = useMutation<LeaveSpaceRes, ApiError>(leaveSpcApi(spaceId!), {
    onSuccess: data => {
      nav('/');
    },
  });

  const handleLeaveSpc = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    leaveSpc.mutate();
  };

  return (
    <>
      {leaveSpc.isError && <p className="error">{leaveSpc.error?.message}</p>}
      <button onClick={handleLeaveSpc} style={{ color: 'red' }}>
        Submit
      </button>
      <button onClick={() => dispatch({ type: 'showLeaveSpc' })} style={{ color: 'green' }}>
        Cancel
      </button>{' '}
      {/* //!solve console errors if still exist*/}
    </>
  );
};
