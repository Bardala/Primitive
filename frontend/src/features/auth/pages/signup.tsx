import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { LOCALS, ROUTES, signUpApi } from '@/core/utils';
import { LoadingSpinner } from '@/shared';

import { FormEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border-light bg-surface-light p-8 shadow-xl dark:border-border-dark dark:bg-surface-dark">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <FiUser size={24} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('signup.title')}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t('signup.subtitle')}
          </p>
        </div>

        <form onSubmit={signUpUser} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
            >
              <FiMail className="text-primary-500" />
              {t('signup.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-base w-full"
              placeholder={t('signup.emailPlaceholder')}
              required
            />
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
            >
              <FiUser className="text-primary-500" />
              {t('signup.username')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-base w-full"
              placeholder={t('signup.usernamePlaceholder')}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
            >
              <FiLock className="text-primary-500" />
              {t('signup.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-base w-full pr-10"
                placeholder={t('signup.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-primary-600 dark:text-text-secondary-dark dark:hover:text-primary-400"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
            >
              <FiLock className="text-primary-500" />
              {t('signup.confirmPassword')}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-base w-full pr-10"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-primary-600 dark:text-text-secondary-dark dark:hover:text-primary-400"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary flex w-full justify-center py-3 text-base"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : t('signup.button')}
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
              <span className="text-lg">⚠</span>
              {error}
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <p className="flex items-center justify-center gap-1">
              {t('signup.haveAccount')}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                {t('signup.signIn')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
