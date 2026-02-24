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
    <div className="flex flex-col gap-4">
      {leaveSpc.isError && <p className="text-sm text-red-500">{leaveSpc.error?.message}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLeaveSpc}
          disabled={leaveSpc.isLoading}
          className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 shadow-md"
        >
          {leaveSpc.isLoading ? '...' : t('leaveSpace.submit')}
        </button>
        <button
          onClick={() => dispatch({ type: 'showLeaveSpc' })}
          className="flex-1 rounded-xl border border-border-light bg-surface-light px-4 py-2.5 text-sm font-bold text-text-primary-light transition-all hover:bg-background-light dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:hover:bg-background-dark"
        >
          {t('leaveSpace.cancel')}
        </button>
      </div>
    </div>
  );
};
