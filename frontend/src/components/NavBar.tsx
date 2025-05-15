import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { CiLogout } from 'react-icons/ci';
import { IoIosPeople } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isLoggedIn, logOut } from '../fetch/auth';
import '../styles/navBar.css';
import { NotificationIcon } from './NotificationIcon';

const AppIcon = '/PrimitiveIcon.ico';

export const NavBar = () => {
  const url = window.location.pathname.split('/')[1];
  const AppName = 'Primitive';
  const [signUp, setSignUp] = useState(false);
  const { refetchCurrUser, currUser } = useAuthContext();

  const nav = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn() && !signUp) {
      queryClient.removeQueries();
      nav('/login');
    }

    url === 'login' && isLoggedIn() && nav('/');
  }, [nav, queryClient, signUp, url]);

  const handleClick = useCallback(() => {
    logOut();
    refetchCurrUser();
    window.location.reload();
    nav('/login');
  }, [nav, refetchCurrUser]);

  if (!isLoggedIn())
    return (
      <header className="navbar">
        <div className="title-wrapper">
          <img src={AppIcon} alt={AppName} className="app-icon" />
        </div>
        <nav className="links">
          <Link to="/signup" onClick={() => setSignUp(true)}>
            Signup
          </Link>
          <Link to="/login">Login</Link>
          <ToggleThemeButton />
        </nav>
      </header>
    );

  return (
    <header className="navbar">
      <>
        <div className="title-wrapper">
          <img src={AppIcon} alt={AppName} className="app-icon" />
          {currUser && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`/u/${currUser.id}`} className="username">
                {currUser.username}
              </Link>
            </div>
          )}
        </div>

        <nav className="links">
          <Link to="/notifications" className="notifications-link">
            <NotificationIcon />
          </Link>
          <Link to="/u">
            <IoIosPeople />
          </Link>
          <Link to="/">
            <TiHome />
          </Link>
          <button onClick={handleClick}>
            <CiLogout />
          </button>
          <ToggleThemeButton />
        </nav>
      </>
    </header>
  );
};

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      <span className="icon">{isDarkMode ? '☀️' : '🌙'}</span>
    </button>
  );
};

// const NotificationIcon = () => {
//   const { missedMsgs } = useGetAllMissedMsgs();
//   const [showNotification, setShowNotification] = useState(false);
//   const notificationRef = useRef<HTMLDivElement>(null);
//   const numOfMissedMsgs = missedMsgs?.reduce((acc, curr) => acc + curr.unread_count, 0) as number;

//   useClickOutside(notificationRef, () => setShowNotification(false));

//   return (
//     <TbMessageCirclePlus
//       className={`notification-icon ${numOfMissedMsgs > 0 ? 'new-msgs' : ''}`}
//       style={numOfMissedMsgs! > 0 ? { color: 'green' } : { color: '#dbd8d8' }}
//       onClick={() => setShowNotification(!showNotification)}
//     />
//   );
// };
