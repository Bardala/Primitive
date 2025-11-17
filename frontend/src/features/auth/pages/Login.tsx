import { useLoginMutation } from '@/core/hooks';
import { ROUTES } from '@/core/utils';
import { LoadingSpinner } from '@/shared/layout';

import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/login.css';

export const Login = () => {
  const { t } = useTranslation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  const handleSubmit = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();
      loginMutation.mutate({ login, password });
    },
    [login, password, loginMutation]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isLoading = loginMutation.isLoading;
  const error = loginMutation.error?.message || null;

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
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
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
            {isLoading ? <LoadingSpinner /> : t('login.button')}
          </button>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
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
