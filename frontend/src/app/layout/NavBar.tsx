import { useAuthContext, useTheme } from '@/core/context';
import { useSideBar } from '@/core/context/SideBarContext';
import { isLoggedIn } from '@/core/services';
import { ROUTES } from '@/core/utils';
import { ChatIcon } from '@/features/chat/components/ChatIcon';
import { NotificationIcon } from '@/features/notification/components';

import { useTranslation } from 'react-i18next';
import { TiHome } from 'react-icons/ti';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const AppIcon = '/PrimitiveIcon.ico';

export const NavBar = () => {
  const { t } = useTranslation();
  const AppName = 'Primitive';
  const { currUser } = useAuthContext();
  const { dispatch } = useSideBar();
  const nav = useNavigate();

  const NavAction = ({ to, icon }: { to: string; icon: React.ReactNode }) => (
    <Link
      to={to}
      className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-primary-50 dark:hover:bg-white/10"
    >
      {icon}
    </Link>
  );

  if (!isLoggedIn())
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border-light bg-surface-light/95 backdrop-blur-md transition-all dark:border-border-dark dark:bg-surface-dark/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={AppIcon}
              alt={AppName}
              className="h-9 w-9 cursor-pointer rounded-xl object-cover transition-transform hover:rotate-6 hover:scale-105"
              onClick={() => nav(ROUTES.HOME)}
            />
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
              {AppName}
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to={ROUTES.SIGNUP}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-95"
            >
              {t('navbar.signup')}
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="hidden rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-600 shadow-sm transition-all hover:bg-primary-50 dark:border-primary-800 dark:bg-surface-dark dark:text-primary-400 dark:hover:bg-primary-900/20 sm:block"
            >
              {t('navbar.login')}
            </Link>
            <ToggleThemeButton />

          </nav>
        </div>
      </header>
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light bg-surface-light/80 backdrop-blur-xl transition-all dark:border-border-dark/60 dark:bg-surface-dark/80 sm:hidden">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo and Profile */}
        <div className="flex items-center gap-2">
          <img
            src={AppIcon}
            alt={AppName}
            className="h-8 w-8 cursor-pointer rounded-xl object-cover transition-transform hover:rotate-6 hover:scale-110"
            onClick={() => dispatch({ type: 'toggleMobileSidebar' })}
          />
        </div>

        {/* Right: Nav Actions */}
        <nav className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <NavAction to={ROUTES.HOME} icon={
              <div className={`relative inline-block text-text-secondary-light dark:text-text-secondary-dark`}>
                <TiHome className="text-2xl align-middle" />
              </div>
              } />
            <NavAction to={ROUTES.NOTIFICATIONS} icon={<NotificationIcon className="text-text-secondary-light dark:text-text-secondary-dark" />} />
            <NavAction to={ROUTES.CHAT} icon={<ChatIcon className="text-text-secondary-light dark:text-text-secondary-dark" />} />
          </div>

          {/* User Avatar */}
          <div className="ml-1">
            <Link
              // to={`/u/${currUser?.id}`}
             to={ROUTES.GET_USER_PROFILE(currUser?.id!)} 
              className="group relative block h-8 w-8 overflow-hidden rounded-full ring-2 ring-border-light transition-all hover:ring-primary-500 dark:ring-border-dark/60"
            >
              <div className="flex h-full w-full items-center justify-center bg-primary-100 text-sm font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                {currUser?.username?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className="group flex items-center gap-2 rounded-xl p-2.5 text-text-secondary-light transition-all hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10 dark:hover:text-primary-400 sm:px-3"
    title={label}
  >
    <div className="transition-transform group-hover:scale-110">{icon}</div>
    <span className="hidden text-sm font-bold md:inline">{label}</span>
  </Link>
);

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-light text-xl transition-all hover:bg-primary-50 hover:text-primary-600 active:scale-90 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-primary-400"
    >
      {isDarkMode ? <MdOutlineDarkMode size={26} /> : <MdOutlineLightMode size={26} />}
    </button>
  );
};
