import { ROUTES } from '@/core/utils';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const UserLink: React.FC<{
  userId: string;
  username?: string;
  complete?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ userId, username, complete = true, className, children }) => {
  return (
    <Link
      to={ROUTES.GET_USER_PROFILE(userId)}
      className={
        className ||
        'flex items-center gap-1.5 font-medium text-text-primary-light no-underline transition-colors hover:text-primary-600 dark:text-text-primary-dark dark:hover:text-primary-400'
      }
      title={username}
    >
      {children ? (
        children
      ) : (
        <>
          <FaUser className="text-sm" />
          <strong className="font-semibold">
            {complete ? username : username?.substring(0, 8)}
          </strong>
        </>
      )}
    </Link>
  );
};
