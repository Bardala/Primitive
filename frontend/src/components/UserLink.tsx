import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const UserLink: React.FC<{ userId: string; username: string }> = ({ userId, username }) => {
  return (
    <Link
      to={`/u/${userId}`}
      className="user-link"
      style={{
        textDecoration: 'none',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: '500',
      }}
      title={username}
    >
      <FaUser /> <strong>{username}</strong>
      {/* <span className="user-status"></span> */}
    </Link>
  );
};
