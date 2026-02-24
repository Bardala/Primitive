import { ApiError } from '@/core/services';
import { useUpdatePassword } from '@/features/auth/hooks';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const PasswordUpdate = () => {
  const { t } = useTranslation();
  const { mutate: updatePassword, isLoading, error } = useUpdatePassword();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [clientErrors, setClientErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear client errors when user starts typing
    if (clientErrors.length > 0) {
      setClientErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      errors.push(t('settings.password.allFieldsRequired'));
    }

    if (formData.newPassword.length < 8) {
      errors.push(t('settings.password.lengthHint'));
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.push(t('settings.password.passwordsDontMatch'));
    }

    setClientErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setClientErrors([]);

    if (!validateForm()) {
      return;
    }

    updatePassword(
      {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setSuccessMessage(t('settings.password.updateSuccess'));
          setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        },
        onError: error => {
          console.error('Password update failed:', error);
        },
      }
    );
  };

  const getErrorMessage = (error: ApiError | null) => {
    if (!error) return null;

    switch (error.message) {
      case 'ALL_FIELDS_REQUIRED':
        return t('settings.password.allFieldsRequired');
      case 'INVALID_PASSWORD':
        return t('settings.password.invalidOldPassword');
      case 'USER_NOT_FOUND':
        return t('settings.password.userNotFound');
      default:
        return error.message || t('settings.password.updateFailed');
    }
  };

  const isFormValid =
    formData.oldPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword.length >= 8 &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
        <span>🔒</span> {t('settings.password.title')}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            {t('settings.password.oldPassword')}
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="input-base w-full"
            placeholder={t('settings.password.oldPasswordPlaceholder')}
            required
            minLength={8}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            {t('settings.password.newPassword')}
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="input-base w-full"
            placeholder={t('settings.password.newPasswordPlaceholder')}
            required
            minLength={8}
            maxLength={20}
          />
          <small className="block text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {t('settings.password.lengthHint')}
          </small>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            {t('settings.password.confirmPassword')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-base w-full"
            placeholder={t('settings.password.confirmPasswordPlaceholder')}
            required
            minLength={8}
          />
        </div>

        {clientErrors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {clientErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {getErrorMessage(error)}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary mt-2 w-full justify-center"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? t('settings.password.updating') : t('settings.password.updateButton')}
        </button>
      </form>
    </div>
  );
};
