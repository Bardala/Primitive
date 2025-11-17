import { SideBarAction } from '@/core/hooks/sideBarReducer';
import { ApiError } from '@/core/services';
import { leaveSpcApi } from '@/core/utils';

import { LeaveSpaceRes } from '@nest/shared';

import { useMutation } from '@tanstack/react-query';
import { FC, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const LeaveSpc: FC<{ spaceId: string; dispatch: React.Dispatch<SideBarAction> }> = ({
  spaceId,
  dispatch,
}) => {
  const nav = useNavigate();
  const { t } = useTranslation();

  const leaveSpc = useMutation<LeaveSpaceRes, ApiError>(leaveSpcApi(spaceId!), {
    onSuccess: () => {
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
        {t('leaveSpace.submit')}
      </button>
      <button onClick={() => dispatch({ type: 'showLeaveSpc' })} style={{ color: 'green' }}>
        {t('leaveSpace.cancel')}
      </button>
    </>
  );
};
