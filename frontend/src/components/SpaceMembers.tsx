import { SpaceMember } from '@nest/shared';
import { Link } from 'react-router-dom';

export const SpaceMembers: React.FC<{ users: SpaceMember[] }> = ({ users }) => {
  return (
    <div className="space-user-list">
      <h2>List of users</h2>
      {/* {error && <div className="error">error</div>} */}
      <ul>
        {users &&
          users.map(user => (
            <li key={user.memberId}>
              <Link to={`/u/${user.memberId}`}>
                <p className="username">
                  {user.isAdmin && <strong>admin</strong>} {user.memberId}
                </p>
                {/* <div className="counts-container">
                  <p className="followers-count"> {user.followers.length} followers </p>
                  <p className="blogs-count">{user.blogs.length} blogs</p>
                  <p className="comments-count">{user.comments.length} comments</p>
                </div> */}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
