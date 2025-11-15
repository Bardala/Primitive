import { FormEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { ROUTES } from 'src/utils/routes';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/login.css';
import { signUpApi } from '../utils/api';
import { LOCALS } from '../utils/localStorage';

export const SignUp = () => {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { refetchCurrUser } = useAuthContext();

  const signUpUser = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      if (password !== confirmPassword) {
        setError(t('signup.passwordMismatch'));
        setIsLoading(false);
        return;
      }

      try {
        const currUser = await signUpApi(email, password, username);
        localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(currUser));
        refetchCurrUser();
        nav(ROUTES.HOME);
      } catch (err) {
        setError((err as ApiError).message || t('signup.error'));
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, confirmPassword, username, refetchCurrUser, nav, t]
  );

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <FiUser />
          </div>
          <h1 className="auth-title">{t('signup.title')}</h1>
          <p className="auth-subtitle">{t('signup.subtitle')}</p>
        </div>

        <form onSubmit={signUpUser} className="auth-form">
          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              <FiMail className="input-icon" />
              {t('signup.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder={t('signup.emailPlaceholder')}
              required
            />
          </div>

          {/* Username Field */}
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              <FiUser className="input-icon" />
              {t('signup.username')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-field"
              placeholder={t('signup.usernamePlaceholder')}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              <FiLock className="input-icon" />
              {t('signup.password')}
            </label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field password-input"
                placeholder={t('signup.passwordPlaceholder')}
                required
              />
              <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              <FiLock className="input-icon" />
              {t('signup.confirmPassword')}
            </label>
            <div className="password-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-field password-input"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`auth-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : t('signup.button')}
          </button>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Login Link */}
          <div className="auth-footer">
            <p className="auth-footer-text">
              {t('signup.haveAccount')}{' '}
              <Link to={ROUTES.LOGIN} className="auth-link">
                {t('signup.signIn')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
