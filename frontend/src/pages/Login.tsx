import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/login.css';
import { loginApi } from '../utils/api';
import { LOCALS } from '../utils/localStorage';

export const Login = () => {
  const nav = useNavigate();
  const { refetchCurrUser } = useAuthContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState() as any;

  const handleSubmit = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();
      try {
        const currUser = await loginApi(login, password);
        localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(currUser));
        refetchCurrUser();
        nav('/');
      } catch (err) {
        console.error(err);
        setError((err as ApiError).message);
      }
    },
    [login, nav, password, refetchCurrUser]
  );

  return (
    <>
      <form onSubmit={e => handleSubmit(e)} className="login">
        <h3>Login</h3>
        <label htmlFor="login">
          Login by <strong>Email</strong> or <strong>Username</strong>
        </label>
        <input id="login" type="text" value={login} onChange={e => setLogin(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
};
