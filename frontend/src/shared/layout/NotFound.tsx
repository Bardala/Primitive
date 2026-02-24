import { ROUTES } from '@/core/utils';

import { useTranslation } from 'react-i18next';
import { FiFrown, FiHome, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background-light to-surface-light p-6 dark:from-background-dark dark:to-surface-dark sm:p-10">
      <div className="w-full max-w-[600px] text-center">
        <div className="rounded-2xl border border-border-light bg-surface-light p-8 shadow-lg dark:border-border-dark dark:bg-surface-dark sm:p-12">
          <div className="relative mb-6 inline-block">
            <FiFrown className="animate-bounce text-6xl text-text-secondary-light dark:text-text-secondary-dark" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-2 border-primary-500 opacity-30"></div>
          </div>

          <h1 className="mb-4 bg-gradient-to-br from-primary-600 to-green-500 bg-clip-text text-4xl font-bold text-transparent dark:from-primary-400 dark:to-green-400 sm:text-5xl">
            {t('notFound.title')}
          </h1>
          <p className="mb-6 text-lg leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
            {t('notFound.description')}
          </p>

          <div className="my-6 select-none text-6xl font-black leading-none text-gray-200 opacity-50 dark:text-gray-800 sm:text-8xl">
            404
          </div>

          <div className="my-10 flex flex-wrap justify-center gap-4">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 rounded-lg border-2 border-primary-600 bg-primary-600 px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-green-500 hover:bg-green-500 hover:shadow-md dark:border-primary-500 dark:bg-primary-500 dark:hover:border-green-600 dark:hover:bg-green-600"
            >
              <FiHome className="text-xl" />
              {t('notFound.goHome')}
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 rounded-lg border-2 border-border-light bg-transparent px-6 py-3 text-base font-semibold text-text-secondary-light transition-all hover:-translate-y-0.5 hover:border-primary-600 hover:text-primary-600 dark:border-border-dark dark:text-text-secondary-dark dark:hover:border-primary-400 dark:hover:text-primary-400"
            >
              {t('notFound.goBack')}
            </button>
          </div>

          <div className="mt-10 border-t border-border-light pt-10 dark:border-border-dark">
            <h3 className="mb-4 text-lg font-semibold text-text-secondary-light dark:text-text-secondary-dark">
              {t('notFound.suggestionsTitle')}
            </h3>
            <ul className="m-0 list-none p-0">
              <li className="flex items-center justify-center gap-2 py-2 text-text-secondary-light dark:text-text-secondary-dark">
                <FiSearch className="min-w-[20px] font-bold text-primary-600 dark:text-primary-400" />
                {t('notFound.suggestion1')}
              </li>
              <li className="flex items-center justify-center gap-2 py-2 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="min-w-[20px] font-bold text-primary-600 dark:text-primary-400">
                  ✓
                </span>
                {t('notFound.suggestion2')}
              </li>
              <li className="flex items-center justify-center gap-2 py-2 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="min-w-[20px] font-bold text-primary-600 dark:text-primary-400">
                  ↻
                </span>
                {t('notFound.suggestion3')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
