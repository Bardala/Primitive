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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`links ${isMenuOpen ? 'active' : ''}`}>
            <Link
              to="/signup"
              onClick={() => {
                setSignUp(true);
                setIsMenuOpen(false);
              }}
              className="nav-link signup-btn"
            >
              Signup
            </Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="nav-link login-btn">
              Login
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
          <img src={AppIcon} alt={AppName} className="app-icon" />
          {currUser && (
            <Link to={`/u/${currUser.id}`} className="user-section">
              <span className="username">{currUser.username}</span>
              <span className="user-status"></span>
            </Link>
          )}
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)} title="Home">
            <TiHome />
            <span className="nav-text">Home</span>
          </Link>
          <Link to="/u" className="nav-link" onClick={() => setIsMenuOpen(false)} title="Users">
            <IoIosPeople />
            <span className="nav-text">Users</span>
          </Link>
          <Link
            to="/notifications"
            className="nav-link notifications-link"
            onClick={() => setIsMenuOpen(false)}
            title="Notifications"
          >
            <NotificationIcon />
            <span className="nav-text">Notifications</span>
          </Link>
          <button onClick={handleClick} className="nav-link logout-btn" title="Logout">
            <CiLogout />
            <span className="nav-text">Logout</span>
          </button>
          <ToggleThemeButton />
        </nav>
      </div>
    </header>
  );
};

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle nav-link" title="Toggle theme">
      <span className="icon">{isDarkMode ? '☀️' : '🌙'}</span>
      <span className="nav-text">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};
