import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CiLogout } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from 'src/components/LanguageSwitcher';
import { useAuthContext } from 'src/context/AuthContext';
import { logOut } from 'src/fetch/auth';

import '../styles/settings.css';

export const Settings = () => {
  const { refetchCurrUser } = useAuthContext();
  const nav = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleClick = useCallback(() => {
    queryClient.clear();
    logOut();
    refetchCurrUser();
    nav('/login', { replace: true });
  }, [nav, queryClient, refetchCurrUser]);

  return (
    <div className="settings-container">
      <h2 className="settings-title">⚙️ {t('settings.title')}</h2>

      <div className="settings-card">
        <div className="settings-item">
          <span className="settings-label">🌐 {t('settings.language')}</span>
          <LanguageSwitcher />
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
