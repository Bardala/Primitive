import { useLoginMutation } from '@/core/hooks';
import { ROUTES } from '@/core/utils';
import { LoadingSpinner } from '@/shared/layout';

import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border-light bg-surface-light p-8 shadow-xl dark:border-border-dark dark:bg-surface-dark">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <FiUser size={24} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('login.title')}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            {t('login.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="login"
              className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
            >
              <FiMail className="text-primary-500" />
              <Trans
                i18nKey="login.loginBy"
                components={{ strong: <strong className="font-bold" /> }}
              />
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="input-base w-full"
              placeholder={t('login.loginPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
            >
              <FiLock className="text-primary-500" />
              {t('login.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-base w-full pr-10"
                placeholder={t('login.passwordPlaceholder')}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-primary-600 dark:text-text-secondary-dark dark:hover:text-primary-400"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary flex w-full justify-center py-3 text-base"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : t('login.button')}
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
              <span className="text-lg">⚠</span>
              {error}
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <p className="flex items-center justify-center gap-1">
              {t('login.noAccount')}
              <Link
                to={ROUTES.SIGNUP}
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                {t('login.signUp')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
