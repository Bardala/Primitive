import { useAuthContext, useTheme } from '@/core/context';
import { isLoggedIn } from '@/core/services';
import { ROUTES } from '@/core/utils';
import { ChatIcon } from '@/features/chat/components/ChatIcon';
import { NotificationIcon } from '@/features/notification/components';
import { UserLink } from '@/features/user';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCog } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { TiHome } from 'react-icons/ti';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/navBar.css';

const AppIcon = '/PrimitiveIcon.ico';

export const NavBar = () => {
  const { t } = useTranslation();
  const AppName = 'Primitive';
  const [, setSignUp] = useState(false);
  const { currUser } = useAuthContext();
  const [isMobile] = useState(window.innerWidth <= 768);

  const nav = useNavigate();

  if (!isLoggedIn())
    return (
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo-section">
            <img
              src={AppIcon}
              alt={AppName}
              className="app-icon"
              onClick={() => nav(ROUTES.HOME)}
            />
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
          <img src={AppIcon} alt={AppName} className="app-icon" onClick={() => nav(ROUTES.HOME)} />
          {/* {currUser && (
            <Link to={`/u/${currUser.id}`} className="user-section" title={t('navbar.myProfile')}>
              <span className="username">{currUser.username.substring(0, 5)}</span>
              <span className="user-status"></span>
            </Link>
          )} */}
          <UserLink
            username={currUser?.username!}
            userId={currUser?.id!}
            complete={false}
            className={'user-section'}
          />
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
            <FaCog />
            {!isMobile && <span className="nav-text">{t('navbar.settings')}</span>}
          </Link>
          <ChatIcon />

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
