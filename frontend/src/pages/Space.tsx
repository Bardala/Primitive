import { Blog, DefaultSpaceId, Short } from '@nest/shared';
import { useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useSpace } from '../hooks/useSpace';
import { Home } from './Home';

// todo: add infinite scroll
export const Space = () => {
  const { id } = useParams();
  const {
    spaceQuery,
    blogsQuery,
    membersQuery,
    numOfUnReadMsgs,
    joinSpaceMutate,
    isMember,
    isEnd,
  } = useSpace(id!);
  const blogs = blogsQuery.data?.pages.flatMap(page => page.blogs) || [];
  const posts: (Blog | Short)[] = [...blogs].sort(
    (a, b) => (b.timestamp as number) - (a.timestamp as number)
  );

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

          {posts?.length ? (
            <>
              <BlogList posts={posts} />
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
