import { Space, SpaceMember } from '@nest/shared';
import { Link } from 'react-router-dom';

export const SpaceMembers: React.FC<{ users: SpaceMember[]; space: Space }> = ({
  users,
  space,
}) => {
  return (
    <div className="space-user-list">
      <h3>{users.length} users</h3>
      <ul>
        {users &&
          users.map(user => (
            <li key={user.memberId}>
              <Link to={`/u/${user.memberId}`}>
                <p className="username">
                  {user.memberId === space.ownerId ? '👑' : user.isAdmin ? '👮‍♂️' : ''}{' '}
                  {user.username}
                </p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
