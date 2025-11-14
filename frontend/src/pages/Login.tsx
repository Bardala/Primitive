import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/login.css';
import { loginApi } from '../utils/api';
import { LOCALS } from '../utils/localStorage';
import { ROUTES } from '../utils/routes';

export const Login = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const { refetchCurrUser } = useAuthContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();
      try {
        const currUser = await loginApi(login, password);
        localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(currUser));
        refetchCurrUser();

        // Redirect to the page they tried to visit or home
        const from = location.state?.from?.pathname || ROUTES.HOME;
        nav(from, { replace: true });
      } catch (err) {
        console.error(err);
        setError((err as ApiError).message);
      }
    },
    [login, nav, password, refetchCurrUser, location.state]
  );

  return (
    <form onSubmit={handleSubmit} className="login">
      <h3>{t('login.title')}</h3>

      <label htmlFor="login">
        <Trans i18nKey="login.loginBy" components={{ strong: <strong /> }} />
      </label>
      <input id="login" type="text" value={login} onChange={e => setLogin(e.target.value)} />

      <label htmlFor="password">{t('login.password')}</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit" className="login-btn">
        {t('login.button')}
      </button>

      {error && <p className="error">{t('login.error')}</p>}
    </form>
  );
};
