import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { isLoggedIn, logOut } from '../fetch/auth';
import '../styles/navBar.css';

export const NavBar = () => {
  const [signUp, setSignUp] = useState(false);
  const { refetchCurrUser, currUser } = useAuthContext();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn() && !signUp) {
      nav('/login');
      queryClient.removeQueries();
    }
  }, [nav, queryClient, signUp]);

  const handleClick = useCallback(() => {
    logOut();
    refetchCurrUser();
    queryClient.removeQueries();
    nav('/login');
  }, [nav, queryClient, refetchCurrUser]);

  return (
    <header className="navbar">
      {!isLoggedIn() ? (
        <>
          <div className="title-wrapper">
            <h1>Nest</h1>
          </div>
          <nav className="links">
            <Link to="/signup" onClick={() => setSignUp(true)}>
              Signup
            </Link>
            <Link to="/login">Login</Link>
          </nav>
        </>
      ) : (
        <>
          <div className="title-wrapper">
            <h1>Nest</h1>
            {currUser && (
              <Link to={`/u/${currUser.id}`} className="username">
                {currUser.username}
              </Link>
            )}
          </div>

          <nav className="links">
            <Link to="/u">users</Link>
            <Link to="/">Home</Link>
            <button onClick={handleClick}>logout</button>
          </nav>
        </>
      )}
    </header>
  );
};
