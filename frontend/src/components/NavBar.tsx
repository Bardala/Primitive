import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { isLoggedIn, logOut } from '../fetch/auth';
import '../styles/navBar.css';
import { NotificationMenu } from './NotificationMenu';

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
      <>
        <div className="title-wrapper">
          <h1>{AppName}</h1>
        </div>
        <nav className="links">
          <Link to="/signup" onClick={() => setSignUp(true)}>
            Signup
          </Link>
          <Link to="/login">Login</Link>
        </nav>
      </>
    );

  return (
    <header className="navbar">
      <>
        <div className="title-wrapper">
          <h1>{AppName}</h1>
          {currUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Link to={`/u/${currUser.id}`} className="username">
                {currUser.username}
              </Link>
              <NotificationMenu />
            </div>
          )}
        </div>

        <nav className="links">
          <Link to="/u">users</Link>
          <Link to="/">Home</Link>
          <button onClick={handleClick}>logout</button>
        </nav>
      </>
    </header>
  );
};
