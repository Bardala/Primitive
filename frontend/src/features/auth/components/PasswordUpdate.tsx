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
    <div className="password-update-container">
      <h3 className="password-update-title">🔒 {t('settings.password.title')}</h3>

      <form onSubmit={handleSubmit} className="password-update-form">
        <div className="form-group">
          <label htmlFor="oldPassword" className="form-label">
            {t('settings.password.oldPassword')}
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="form-input"
            placeholder={t('settings.password.oldPasswordPlaceholder')}
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            {t('settings.password.newPassword')}
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="form-input"
            placeholder={t('settings.password.newPasswordPlaceholder')}
            required
            minLength={8}
            maxLength={20}
          />
          <small className="form-help">{t('settings.password.lengthHint')}</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            {t('settings.password.confirmPassword')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            placeholder={t('settings.password.confirmPasswordPlaceholder')}
            required
            minLength={8}
          />
        </div>

        {clientErrors.length > 0 && (
          <div className="error-message">
            {clientErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {error && <div className="error-message">{getErrorMessage(error)}</div>}

        {successMessage && <div className="success">{successMessage}</div>}

        <button type="submit" className="update-password-btn" disabled={isLoading || !isFormValid}>
          {isLoading ? t('settings.password.updating') : t('settings.password.updateButton')}
        </button>
      </form>
    </div>
  );
};
