import { useAuthContext } from '@/core/context';
import { logOut } from '@/core/services';
import { PasswordUpdate } from '@/features/auth';
import { LanguageSwitcher } from '@/shared';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CiLock, CiLogout } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

import '../styles/settings.css';

export const Settings = () => {
  const { refetchCurrUser } = useAuthContext();
  const nav = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);

  const handleClick = useCallback(() => {
    queryClient.clear();
    logOut();
    refetchCurrUser();
    nav('/login', { replace: true });
  }, [nav, queryClient, refetchCurrUser]);

  const togglePasswordUpdate = () => {
    setShowPasswordUpdate(!showPasswordUpdate);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">⚙️ {t('settings.title')}</h2>

      <div className="settings-card">
        <div className="settings-item">
          <span className="settings-label">🌐 {t('settings.language')}</span>
          <LanguageSwitcher />
        </div>

        <div className="password-section">
          <button
            onClick={togglePasswordUpdate}
            className="toggle-password-btn"
            title={t('settings.password.toggle')}
          >
            <CiLock size={22} />
            <span className="toggle-text">
              {showPasswordUpdate ? t('settings.password.hide') : t('settings.password.show')}
            </span>
          </button>

          {showPasswordUpdate && <PasswordUpdate />}
        </div>

        <div className="settings-item">
          <button onClick={handleClick} className="logout-btn" title={t('settings.logout')}>
            <CiLogout size={22} />
            <span className="logout-text">{t('settings.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
