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
  const [isMobile] = useState(window.innerWidth <= 768);

  const nav = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn() && !signUp) {
      queryClient.removeQueries();
      nav('/login', { replace: true });
    }

    url === 'login' && isLoggedIn() && nav('/');
  }, [nav, queryClient, signUp, url]);

  const handleClick = useCallback(() => {
    logOut();
    refetchCurrUser();
    nav('/login', { replace: true });
  }, [nav, refetchCurrUser]);

  if (!isLoggedIn())
    return (
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo-section">
            <img src={AppIcon} alt={AppName} className="app-icon" />
            <span className="app-name">{AppName}</span>
          </div>

          <nav className="links">
            <Link
              to="/signup"
              onClick={() => setSignUp(true)}
              className="nav-link signup-btn"
              title="Sign Up"
            >
              {isMobile ? 'Sign Up' : 'Sign Up'}
            </Link>
            <Link to="/login" className="nav-link login-btn" title="Login">
              {isMobile ? 'Login' : 'Login'}
            </Link>
            <ToggleThemeButton />
          </nav>
        </div>
      </header>
    );

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <img src={AppIcon} alt={AppName} className="app-icon" onClick={() => nav('/')} />
          {currUser && (
            <Link to={`/u/${currUser.id}`} className="user-section" title="My Profile">
              <span className="username">{currUser.username}</span>
              <span className="user-status"></span>
            </Link>
          )}
        </div>

        <nav className="links">
          <Link to="/" className="nav-link" title="Home">
            <TiHome />
            {!isMobile && <span className="nav-text">Home</span>}
          </Link>
          <Link to="/u" className="nav-link" title="Users">
            <IoIosPeople />
            {!isMobile && <span className="nav-text">Users</span>}
          </Link>
          <Link to="/notifications" className="nav-link notifications-link" title="Notifications">
            <NotificationIcon />
            {!isMobile && <span className="nav-text">Notifications</span>}
          </Link>
          <button onClick={handleClick} className="nav-link logout-btn" title="Logout">
            <CiLogout />
            {!isMobile && <span className="nav-text">Logout</span>}
          </button>
          <ToggleThemeButton />
        </nav>
      </div>
    </header>
  );
};

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile] = useState(window.innerWidth <= 768);

  return (
    <button onClick={toggleTheme} className="theme-toggle nav-link" title="Toggle theme">
      <span className="icon">{isDarkMode ? '☀️' : '🌙'}</span>
      {!isMobile && <span className="nav-text">{isDarkMode ? 'Light' : 'Dark'}</span>}
    </button>
  );
};
