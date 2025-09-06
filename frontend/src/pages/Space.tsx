import { DefaultSpaceId } from '@nest/shared';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { ActionBar } from '../components/SideBar';
import { useGetSpcMissedMsgs, useSpace } from '../hooks/useSpace';
import { Home } from './Home';

export const Space = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { numOfUnReadMsgs } = useGetSpcMissedMsgs(id!);
  const { spaceQuery, blogsQuery, membersQuery, joinSpaceMutate, isMember, isEnd } = useSpace(id!);

  const blogs = blogsQuery.data?.pages.flatMap(page => page.blogs) || [];

  if (spaceQuery.isError) return <p className="error">{spaceQuery.error?.message}</p>;
  if (spaceQuery.isLoading) return <div>{t('space.loading')}</div>;
  if (id === DefaultSpaceId) return <Home />;

  return (
    <div className="home">
      <main className="space-page">
        <div className="space-header">
          <h2>
            {t('space.title')}: {spaceQuery.data?.space?.name}
          </h2>
          <span>{spaceQuery.data?.space?.status}</span>
        </div>

        {joinSpaceMutate.isError && <p>{joinSpaceMutate.error.message}</p>}

        <nav>
          {!isMember && (
            <button
              className="join-space"
              onClick={() => joinSpaceMutate.mutate()}
              disabled={joinSpaceMutate.isLoading}
            >
              {t('space.join')}
            </button>
          )}
        </nav>

        {blogs?.length ? (
          <>
            <BlogList posts={blogs} />
            {!isEnd && (
              <button onClick={() => blogsQuery.fetchNextPage()}>{t('space.loadMore')}</button>
            )}
          </>
        ) : (
          <div className="not-found">
            <p>{t('space.noBlogs')}</p>
          </div>
        )}
      </main>

      <ActionBar
        space={spaceQuery.data?.space}
        members={membersQuery.data?.members}
        numOfUnReadingMsgs={numOfUnReadMsgs.data?.numOfUnReadMsgs}
      />
    </div>
  );
};
