import { useAuthContext } from '@/core/context';
import { useLogOut } from '@/core/services';
import { PasswordUpdate } from '@/features/auth';
import { LanguageSwitcher } from '@/shared';


import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CiLock, CiLogout } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

// import '../styles/settings.css';
import { MainLayout } from './MainLayout';

// import '../styles/settings.css';

export const Settings = () => {
  const { refetchCurrUser, currUser } = useAuthContext();
  const nav = useNavigate();
  const { t } = useTranslation();

  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);

  const { logOut: performLogOut } = useLogOut();

  const handleClick = useCallback(async () => {
    await performLogOut();
    refetchCurrUser();
    nav('/login', { replace: true });
  }, [nav, performLogOut, refetchCurrUser]);

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-4xl py-6">
        <div className="mb-8 px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            {t('settings.title')}
          </h1>
          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark font-medium">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col gap-6 px-4 sm:px-0">
          {/* Account Section */}
          <section className="rounded-3xl border border-border-light bg-surface-light p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark transition-all hover:shadow-md">
            <h2 className="mb-6 text-xl font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-widest text-[10px] opacity-70">
              Account
            </h2>
            <div className="flex items-center gap-5 mb-8">
              <div className="h-20 w-20 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-inner">
                {currUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {currUser?.username}
                </h3>
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark opacity-80">
                  {(currUser as any)?.email}
                </p>
              </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark pt-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                      {t('settings.language')}
                    </h3>
                    <p className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark opacity-70">
                      Select your preferred language
                    </p>
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="rounded-3xl border border-border-light bg-surface-light p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark transition-all hover:shadow-md">
            <h2 className="mb-6 text-xl font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-widest text-[10px] opacity-70">
              Security
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
                className="group flex w-full items-center justify-between rounded-2xl border border-border-light p-5 transition-all hover:border-primary-500/50 hover:bg-gray-50 dark:border-border-dark dark:hover:bg-primary-900/10"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                    <CiLock size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                      {t('settings.password.toggle')}
                    </span>
                    <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark opacity-70">
                      Change your password to keep your account secure
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                    showPasswordUpdate
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-primary-50 text-primary-600 border-primary-200 group-hover:bg-primary-600 group-hover:text-white'
                  }`}
                >
                  {showPasswordUpdate ? 'Cancel' : 'Update'}
                </span>
              </button>

              {showPasswordUpdate && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <PasswordUpdate />
                </div>
              )}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-3xl border border-red-200 bg-red-50/20 p-8 dark:border-red-900/30 dark:bg-red-900/10">
            <h2 className="mb-6 text-xl font-bold text-red-700 dark:text-red-400 uppercase tracking-widest text-[10px]">
              Danger Zone
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                  {t('settings.logout')}
                </h3>
                <p className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark opacity-70">
                  Sign out of your account on this device
                </p>
              </div>
              <button
                onClick={handleClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-white border border-red-200 px-6 py-3 font-bold text-red-600 shadow-sm transition-all hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 dark:bg-surface-dark dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
              >
                <CiLogout size={20} />
                <span>{t('settings.logout')}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
