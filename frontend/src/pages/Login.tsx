// Login.tsx
import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const currUser = await loginApi(login, password);
        localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(currUser));
        refetchCurrUser();

        const from = location.state?.from?.pathname || ROUTES.HOME;
        nav(from, { replace: true });
      } catch (err) {
        console.error(err);
        setError((err as ApiError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [login, nav, password, refetchCurrUser, location.state]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <FiUser />
          </div>
          <h1 className="auth-title">{t('login.title')}</h1>
          <p className="auth-subtitle">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email/Username Field */}
          <div className="input-group">
            <label htmlFor="login" className="input-label">
              <FiMail className="input-icon" />
              <Trans i18nKey="login.loginBy" components={{ strong: <strong /> }} />
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="input-field"
              placeholder={t('login.loginPlaceholder')}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              <FiLock className="input-icon" />
              {t('login.password')}
            </label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field password-input"
                placeholder={t('login.passwordPlaceholder')}
                required
              />
              <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="auth-helper">
            <a href="#" className="forgot-password">
              {t('login.forgotPassword')}
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`auth-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner"></div> : t('login.button')}
          </button>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {t('login.error')}
            </div>
          )}

          {/* Sign Up Link */}
          <div className="auth-footer">
            <p className="auth-footer-text">
              {t('login.noAccount')}{' '}
              <Link to={ROUTES.SIGNUP} className="auth-link">
                {t('login.signUp')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
