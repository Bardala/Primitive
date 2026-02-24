import { useAuthContext } from '@/core/context';
import { useGetAllUserSpaces } from '@/features/user/hooks/useProfileData';

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const UserSpacesList: React.FC = () => {
  const { currUser } = useAuthContext();
  const { data, isLoading } = useGetAllUserSpaces(currUser?.id || '');
  const navigate = useNavigate();

  const handleSpaceClick = (spaceId: string) => {
    navigate(`/space/${spaceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  const spaces = data?.spaces?.filter(s => s.id !== '1') || [];

  if (spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-text-secondary-light dark:text-text-secondary-dark font-medium">
        <p className="text-sm opacity-60">No spaces joined yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {spaces.map(space => (
        <div
          key={space.id}
          onClick={() => handleSpaceClick(space.id)}
          className="flex items-center justify-between p-4 transition-all cursor-pointer border-b border-border-light/40 dark:border-border-dark/40 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 font-bold text-indigo-600 dark:text-indigo-400">
              {space.name[0].toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                {space.name}
              </span>
              <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark font-medium leading-tight mt-0.5 opacity-70">
                {space.status === 'public' ? 'Public Space' : 'Private Space'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
