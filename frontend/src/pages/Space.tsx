import { DefaultSpaceId } from '@nest/shared';
import { useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useGetSpcMissedMsgs, useSpace } from '../hooks/useSpace';
import { Home } from './Home';

export const Space = () => {
  const { id } = useParams();
  const { numOfUnReadMsgs } = useGetSpcMissedMsgs(id!);
  const { spaceQuery, blogsQuery, membersQuery, joinSpaceMutate, isMember, isEnd } = useSpace(id!);

  const blogs = blogsQuery.data?.pages.flatMap(page => page.blogs) || [];

  if (spaceQuery.isError) return <p className="error">{spaceQuery.error?.message}</p>;
  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (id === DefaultSpaceId) return <Home />;

  return (
    <>
      <div className="home">
        <main className="space-page">
          <div className="space-header">
            <h2>Space: {spaceQuery.data?.space?.name}</h2>
            <span>{spaceQuery.data?.space?.status}</span>
          </div>
          {joinSpaceMutate.isError && <p>{joinSpaceMutate.error.message}</p>}
          <nav>
            <>
              {!isMember && (
                <button
                  className="join-space"
                  onClick={() => joinSpaceMutate.mutate()}
                  disabled={joinSpaceMutate.isLoading}
                >
                  Join
                </button>
              )}
            </>
          </nav>
          {/** //todo: move the description to the sidebar */}
          {/* <span className="space-description">{spaceQuery.data?.space?.description}</span> */}

          {blogs?.length ? (
            <>
              <BlogList posts={blogs} />
              <button hidden={isEnd} disabled={isEnd} onClick={() => blogsQuery.fetchNextPage()}>
                Load More
              </button>
            </>
          ) : (
            <>
              <div className="not-found">
                <p>There isn't blogs</p>
              </div>
            </>
          )}
        </main>
        <Sidebar
          space={spaceQuery.data?.space}
          members={membersQuery.data?.members}
          numOfUnReadingMsgs={numOfUnReadMsgs.data?.numOfUnReadMsgs}
        />
      </div>
    </>
  );
};
