import { FormEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/utils/routes';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/signup.css';
import { signUpApi } from '../utils/api';
import { LOCALS } from '../utils/localStorage';

export const SignUp = () => {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { refetchCurrUser } = useAuthContext();

  const signUpUser = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        setError(t('signup.passwordMismatch'));
        return;
      }

      try {
        const currUser = await signUpApi(email, password, username);
        localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(currUser));
        refetchCurrUser();
        nav(ROUTES.HOME);
      } catch (err) {
        setError((err as ApiError).message || t('signup.error'));
      }
    },
    [email, password, confirmPassword, username, refetchCurrUser, nav, t]
  );

  return (
    <div className="signup-container">
      <form onSubmit={signUpUser} className="signup-card">
        <h3 className="signup-title">{t('signup.title')}</h3>

        <label htmlFor="email" className="signup-label">
          {t('signup.email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="signup-input"
        />

        <label htmlFor="username" className="signup-label">
          {t('signup.username')}
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="signup-input"
        />

        <label htmlFor="password" className="signup-label">
          {t('signup.password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="signup-input"
        />

        <label htmlFor="confirmPassword" className="signup-label">
          {t('signup.confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="signup-input"
        />

        <button type="submit" className="signup-btn">
          {t('signup.button')}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
