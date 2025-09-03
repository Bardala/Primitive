import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosPeople } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isLoggedIn } from '../fetch/auth';
import '../styles/navBar.css';
import { NotificationIcon } from './NotificationIcon';

const AppIcon = '/PrimitiveIcon.ico';

export const NavBar = () => {
  const { t } = useTranslation();
  const url = window.location.pathname.split('/')[1];
  const AppName = 'Primitive';
  const [signUp, setSignUp] = useState(false);
  const { currUser } = useAuthContext();
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
              title={t('navbar.signup')}
            >
              {isMobile ? t('navbar.signup') : t('navbar.signup')}
            </Link>
            <Link to="/login" className="nav-link login-btn" title={t('navbar.login')}>
              {isMobile ? t('navbar.login') : t('navbar.login')}
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
            <Link to={`/u/${currUser.id}`} className="user-section" title={t('navbar.myProfile')}>
              <span className="username">{currUser.username.substring(0, 5)}</span>
              <span className="user-status"></span>
            </Link>
          )}
        </div>

        <nav className="links">
          <Link to="/" className="nav-link" title={t('navbar.home')}>
            <TiHome />
            {!isMobile && <span className="nav-text">{t('navbar.home')}</span>}
          </Link>
          <Link to="/u" className="nav-link" title={t('navbar.users')}>
            <IoIosPeople />
            {!isMobile && <span className="nav-text">{t('navbar.users')}</span>}
          </Link>
          <Link
            to="/notifications"
            className="nav-link notifications-link"
            title={t('navbar.notifications')}
          >
            <NotificationIcon />
            {!isMobile && <span className="nav-text">{t('navbar.notifications')}</span>}
          </Link>
          <Link to="/settings" className="nav-link" title={t('navbar.settings')}>
            <span className="icon">⚙️</span>
            {!isMobile && <span className="nav-text">{t('navbar.settings')}</span>}
          </Link>

          <ToggleThemeButton />
        </nav>
      </div>
    </header>
  );
};

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile] = useState(window.innerWidth <= 768);
  const { t } = useTranslation();

  return (
    <button onClick={toggleTheme} className="theme-toggle nav-link" title={t('navbar.toggleTheme')}>
      <span className="icon">{isDarkMode ? '☀️' : '🌙'}</span>
      {!isMobile && (
        <span className="nav-text">{isDarkMode ? t('navbar.light') : t('navbar.dark')}</span>
      )}
    </button>
  );
};
