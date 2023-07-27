import { UserCard } from '@nest/shared';

import '../styles/userInfoCard.css';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = props => {
  return <></>;
  // const { userCard, blogsLength } = props;
  // let { currUser } = useAuthContext();
  // // currUser = orderedUser;

  // return (
  //   <div className="user-information">
  //     {followUserError && <p className="error">{followUserError}</p>}
  //     {unfollowUserError && <p className="error">{unfollowUserError}</p>}

  //     {currUser && currUser.username === userCard.username && (
  //       <div className="user-links">
  //         <Link to="/createBlog">Create New Blog</Link>
  //         <Link to="/createSpace">Create New Space</Link>
  //       </div>
  //     )}

  //     <div className="card-header">
  //       <h2 className="page">{userCard.username} card</h2>
  //       {currUser && currUser.username !== userCard.username && (
  //         <>
  //           {userCard.followers.includes(currUser._id) ? (
  //             <button
  //               onClick={() => unfollowUser()}
  //               disabled={unfollowUserPending}
  //               className="unfollow"
  //               style={{ backgroundColor: 'red' }}
  //             >
  //               Unfollow
  //             </button>
  //           ) : (
  //             <button onClick={() => followUser()} className="follow" disabled={followUserPending}>
  //               Follow
  //             </button>
  //           )}
  //         </>
  //       )}
  //     </div>

  //     <p>Username: {userCard.username}</p>
  //     <p>Email: {userCard.email}</p>
  //     <p>Followers: {userCard.followers.length}</p>
  //     <p>Following: {userCard.following.length}</p>
  //     <p>Spaces: {userCard.spaces.length}</p>
  //     <p>Blogs: {blogsLength}</p>
  //     <p>Comments: {userCard.comments.length}</p>
  //     <p>
  //       From{' '}
  //       {formatDistantToNow(new Date(userCard.createdAt), {
  //         addSuffix: true,
  //       })}
  //     </p>
  //   </div>
  // );
};
