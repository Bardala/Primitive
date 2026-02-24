import { Home, MainLayout } from '@/app/layout';
import { useSideBar } from '@/core/context/SideBarContext';
import { BlogList } from '@/features/blog';
import { NotificationMsgsNumber } from '@/features/notification/components';

import { DefaultSpaceId } from '@nest/shared';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaComments } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { useSpace } from '../hooks/useSpace';

export const Space = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { state, dispatch } = useSideBar();

  const { spaceQuery, blogsQuery, membersQuery, joinSpaceMutate, isMember, isEnd } = useSpace(id!);

  const blogs = blogsQuery.data?.pages.flatMap(page => page.blogs) || [];
  const space = spaceQuery.data?.space;
  const isChatActive = state.activeChatId === id;

  if (spaceQuery.isError)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        {spaceQuery.error?.message}
      </div>
    );
  if (spaceQuery.isLoading) return <div>{t('space.loading')}</div>;
  if (id === DefaultSpaceId) return <Home />;

  return (
    <MainLayout space={space} members={membersQuery.data?.members}>
      <div className="flex h-full flex-col">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-border-light pb-6 dark:border-border-dark lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {space?.name}
              </h2>
              {isMember && (
                <button
                  onClick={() => {
                    dispatch({ type: 'showChat' });
                  }}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    state.showChat
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-background-light text-primary-600 hover:bg-primary-50 dark:bg-background-dark dark:text-primary-400 dark:hover:bg-primary-900/20'
                  }`}
                  title="Open Chat"
                >
                  <FaComments size={20} />
                  <div className="absolute -top-1 -right-1">
                    <NotificationMsgsNumber spaceId={id!} variant="badge" />
                  </div>
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 uppercase tracking-wide">
                {space?.status}
              </span>
            </div>
          </div>

          {!isMember && (
            <button
              className="btn-primary"
              onClick={() => joinSpaceMutate.mutate()}
              disabled={joinSpaceMutate.isLoading}
            >
              {t('space.join')}
            </button>
          )}
        </div>

        {joinSpaceMutate.isError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {joinSpaceMutate.error.message}
          </div>
        )}

        {/* Content Section */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Blogs Section */}
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {t('space.latestBlogs')}
              </h3>
            </div>
            {blogs.length ? (
              <div className="space-y-4">
                <BlogList posts={blogs} />
                {!isEnd && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => blogsQuery.fetchNextPage()}
                      className="rounded-xl border border-border-light bg-surface-light px-6 py-2.5 font-bold text-text-secondary-light transition-all hover:bg-gray-100 dark:border-border-dark dark:bg-surface-dark dark:text-text-secondary-dark dark:hover:bg-primary-900/10"
                    >
                      {t('space.loadMore')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-text-secondary-light dark:text-text-secondary-dark rounded-3xl border-2 border-dashed border-border-light dark:border-border-dark">
                <p className="text-lg font-medium">{t('space.noBlogs')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
