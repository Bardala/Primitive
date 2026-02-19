// import '../styles/userSpacesSidebar.css';
import { Space } from '@nest/shared';

import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface UserSpacesSidebarProps {
  spaces: Space[];
  isLoading: boolean;
  isError: boolean;
}

export const UserSpacesSidebar = ({ spaces, isLoading, isError }: UserSpacesSidebarProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredSpaces = spaces?.filter(
    space => space.name.toLowerCase().includes(search.toLowerCase()) && space.id !== '1'
  );

  const handleSearch = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

  return (
    <div className="card-base flex h-full max-h-[calc(100vh-100px)] flex-col p-0">
      <div className="border-b border-border-light p-4 dark:border-border-dark">
        <div className="flex items-center gap-2 text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          <FiUsers className="text-primary-600 dark:text-primary-400" />
          <h3>{t('userProfile.spaces')}</h3>
        </div>
      </div>

      <div className="border-b border-border-light p-4 dark:border-border-dark">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="search"
            placeholder={t('userProfile.searchSpaces')}
            value={search}
            onChange={handleSearch}
            className="input-base w-full py-2 pl-10 text-sm"
          />
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
        {isError && (
          <div className="p-4 text-center text-sm text-red-600 dark:text-red-400">
            {t('userProfile.errorSpaces')}
          </div>
        )}

        {isLoading && (
          <div className="p-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {t('userProfile.loadingSpaces')}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {filteredSpaces?.map(space => (
            <Link
              to={`/space/${space.id}`}
              className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-primary-900/10"
              key={space.id}
              title={space.name}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 font-bold text-primary-700 transition-colors group-hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:group-hover:bg-primary-900/50">
                {space.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-text-primary-light group-hover:text-primary-600 dark:text-text-primary-dark dark:group-hover:text-primary-400">
                  {space.name}
                </span>
                <span
                  className={`inline-flex w-fit rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    space.status === 'public'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {space.status}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredSpaces?.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {t('userProfile.noSpaces')}
            </p>
            <Link
              to="/spaces"
              className="flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40"
            >
              <FiPlus className="" />
              Explore Spaces
            </Link>
          </div>
        )}
      </div>

      <div className="border-t border-border-light p-4 dark:border-border-dark">
        <Link
          to="/spaces"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-light p-2 text-sm font-medium text-text-secondary-light transition-colors hover:bg-gray-50 hover:text-primary-600 dark:border-border-dark dark:text-text-secondary-dark dark:hover:bg-primary-900/10 dark:hover:text-primary-400"
        >
          View All Spaces
          <FiPlus />
        </Link>
      </div>
    </div>
  );
};
