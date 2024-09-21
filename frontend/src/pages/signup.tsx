import { FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/login.css';
import { signUpApi } from '../utils/api';
import { LOCALS } from '../utils/localStorage';

export const SignUp = () => {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState() as any;

  const { refetchCurrUser } = useAuthContext();

  const singUpUser = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();

      try {
        const currUser = await signUpApi(email, password, username);
        localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(currUser));
        refetchCurrUser();
        nav('/');
      } catch (err) {
        setError((err as ApiError).message);
      }
    },
    [email, nav, password, refetchCurrUser, username]
  );

  return (
    <>
      <form onSubmit={e => singUpUser(e)} className="login">
        <h3>Sign Up</h3>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
};
