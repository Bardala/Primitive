import { SpaceMember } from '@nest/shared';
import { Link } from 'react-router-dom';

export const SpaceMembers: React.FC<{ users: SpaceMember[] }> = ({ users }) => {
  return (
    <div className="space-user-list">
      <h3>{users.length} users</h3>
      <ul>
        {users &&
          users.map(user => (
            <li key={user.memberId}>
              <Link to={`/u/${user.memberId}`}>
                <p className="username">
                  {!!user.isAdmin && <i>admin</i>} {user.username}
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
