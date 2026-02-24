import { useAuthContext, useTheme } from '@/core/context';
import { useSideBar } from '@/core/context/SideBarContext';
import { ROUTES } from '@/core/utils';
import { ChatIcon } from '@/features/chat/components/ChatIcon';
import { NotificationMsgsNumber } from '@/features/notification/components';
import { NotificationIcon } from '@/features/notification/components';
import { UserLink } from '@/features/user';
import { FollowedUsersList } from '@/features/user/components';

import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaBook,
  FaCog,
  FaComments,
  FaLock,
  FaPencilAlt,
  FaPlus,
  FaSignOutAlt,
} from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { RiGroup2Fill } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import { TiHome } from 'react-icons/ti';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { UserSpacesList } from '../../features/spaces/components/UserSpacesList';

const AppIcon = '/PrimitiveIcon.ico';

export const ActionsSidebar: React.FC<{
  space?: Space;
  members?: SpaceMember[];
}> = ({ space, members }) => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSideBar();
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {state.showMobileSidebar && (
        <div
          className="fixed inset-0 z-90 bg-black/60 backdrop-blur-sm sm:hidden animate-in fade-in duration-300"
          onClick={() => dispatch({ type: 'closeMobileSidebar' })}
        />
      )}

      <aside
        className={`fixed left-0 sm:left-auto sm:sticky top-0 z-100 h-screen flex-col overflow-hidden bg-background-light dark:bg-background-dark shrink-0 transition-all border-r border-border-light dark:border-border-dark/60 ${
          state.showMobileSidebar
            ? 'flex w-[275px] animate-in slide-in-from-left-8 duration-300'
            : 'hidden sm:flex'
        } sm:w-[88px] xl:w-[275px]`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 xl:px-4 w-full">
          <div className="flex flex-col items-center xl:items-start w-full">
            {/* App Logo for Desktop */}
            <div className="hidden sm:flex w-full items-center justify-center xl:justify-start mb-2 px-3">
              <Link
                to="/"
                onClick={() => dispatch({ type: 'closeMobileSidebar' })}
                className="flex items-center justify-center xl:justify-start h-14 w-14 xl:w-full rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10 text-text-primary-light dark:text-text-primary-dark"
              >
                <img src={AppIcon} alt="Primitive" className="h-10 w-10 object-cover rounded-xl" />
              </Link>
            </div>

            {/* User Profile Header for Mobile (Like X.com) */}
            {currUser && (
              <div className="flex sm:hidden flex-col w-full px-4 pt-2 pb-6 mb-2 border-b border-border-light dark:border-border-dark/60">
                <Link
                  to={`/u/${currUser.id}`}
                  onClick={() => dispatch({ type: 'closeMobileSidebar' })}
                >
                  <div className="h-12 w-12 mb-3 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800 text-lg shadow-sm">
                    {currUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[19px] text-text-primary-light dark:text-text-primary-dark leading-tight">
                      {currUser.username}
                    </span>
                    <span className="text-text-secondary-light dark:text-text-secondary-dark text-[15px]">
                      @{currUser.id.substring(0, 8)}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Main Navigation */}
            <NavItem
              icon={<TiHome size={26} />}
              label={t('navbar.home')}
              to="/"
              active={location.pathname === '/'}
              onClick={() => dispatch({ type: 'closeMobileSidebar' })}
            />

            {currUser && (
              <>
              <NavItem
                icon={<IoIosPeople size={26} />}
                label={t('navbar.follow')}
                to="/u"
                active={location.pathname === '/u'}
                onClick={() => dispatch({ type: 'closeMobileSidebar' })}
              />

                <NavItem
                  icon={<NotificationIcon />}
                  label={t('navbar.notifications')}
                  to="/notifications"
                  active={location.pathname === '/notifications'}
                  onClick={() => dispatch({ type: 'closeMobileSidebar' })}
                />
                <NavItem
                  icon={<ChatIcon />}
                  label={t('sidebar.chat') || 'Chat'}
                  to="/chat"
                  active={location.pathname === '/chat'}
                  onClick={() => dispatch({ type: 'closeMobileSidebar' })}
                />
                <NavItem
                  icon={<FaCog size={24} />}
                  label={t('navbar.settings')}
                  to="/settings"
                  active={location.pathname === '/settings'}
                  onClick={() => dispatch({ type: 'closeMobileSidebar' })}
                />

                <NavItem
                  icon={<FaBook size={24} />}
                  label="Series"
                  to="#"
                  onClick={() => {
                    dispatch({ type: 'showCreateSeries' });
                    dispatch({ type: 'closeMobileSidebar' });
                  }}
                />

                {/* <NavItem
                  icon={
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs ring-1 ring-border-light dark:ring-border-dark">
                      {currUser.username.charAt(0).toUpperCase()}
                    </div>
                  }
                  label={t('navbar.profile')}
                  to={`/u/${currUser.id}`}
                  active={location.pathname.startsWith(`/u/${currUser.id}`)}
                  onClick={() => dispatch({ type: 'closeMobileSidebar' })}
                /> */}

                {/* Theme Toggle */}
                <SidebarThemeToggle onClick={() => dispatch({ type: 'closeMobileSidebar' })} />

                {/* Space Navigation if active */}
                {!space && (
                  <SidebarItem
                    icon={<RiGroup2Fill size={26} />}
                    label={t('sidebar.space')}
                    onClick={() => {
                      dispatch({ type: 'showCreateSpace' });
                      dispatch({ type: 'closeMobileSidebar' });
                    }}
                    active={state.showCreateSpace}
                  />
                )}

                {/* Post Button */}
                <div className="mt-4 w-full flex justify-center xl:justify-start xl:px-2 px-4">
                  <button
                    onClick={() => {
                      dispatch({ type: 'showCreateBlog' });
                      dispatch({ type: 'closeMobileSidebar' });
                    }}
                    className="flex items-center justify-center w-full xl:w-[90%] h-[52px] bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-all active:scale-95"
                  >
                    <span className="font-bold text-[17px]">Post</span>
                  </button>
                </div>
              </>
            )}

            {/* Space specific actions */}
            {space && (
              <div className="mt-6 w-full flex flex-col pt-4 border-t border-border-light dark:border-border-dark/60">
                <div className="xl:px-4 mb-2 flex flex-col items-center xl:items-start w-full">
                  <h3 className="hidden xl:block truncate text-base font-bold text-text-primary-light dark:text-text-primary-dark w-full">
                    {space.name}
                  </h3>
                  <div className="xl:hidden flex h-10 w-10 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark font-bold border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark">
                    {space.name.charAt(0)}
                  </div>
                  <span className="hidden xl:block text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {members?.length || 0} Members
                  </span>
                </div>

                {isMember && (
                  <SidebarItem
                    icon={<FaComments size={24} />}
                    label={t('sidebar.chat')}
                    onClick={() => {
                      dispatch({ type: 'showChat' });
                      dispatch({ type: 'closeMobileSidebar' });
                    }}
                    active={state.showChat}
                    badge={<NotificationMsgsNumber spaceId={space.id} variant="badge" />}
                  />
                )}

                {isMember && (
                  <>
                    <SidebarItem
                      icon={<IoIosPeople size={24} />}
                      label={t('sidebar.members')}
                      onClick={() => {
                        dispatch({ type: 'showMembers' });
                        dispatch({ type: 'closeMobileSidebar' });
                      }}
                      active={state.showMembers}
                    />
                    {isAdmin && (
                      <>
                        <SidebarItem
                          icon={<FaPlus size={20} />}
                          label={t('sidebar.addMember')}
                          onClick={() => {
                            dispatch({ type: 'showAddMember' });
                            dispatch({ type: 'closeMobileSidebar' });
                          }}
                          active={state.showAddMember}
                        />
                        <SidebarItem
                          icon={<FaPencilAlt size={20} />}
                          label={t('sidebar.editSpace')}
                          onClick={() => {
                            dispatch({ type: 'showEditSpace' });
                            dispatch({ type: 'closeMobileSidebar' });
                          }}
                          active={state.showEditSpace}
                        />
                        <SidebarItem
                          icon={<FaLock size={20} />}
                          label="Permissions"
                          onClick={() => {
                            dispatch({ type: 'showPermissions' });
                            dispatch({ type: 'closeMobileSidebar' });
                          }}
                          active={state.showPermissions}
                        />
                      </>
                    )}
                    <SidebarItem
                      icon={<FaSignOutAlt size={20} />}
                      label={t('sidebar.leaveSpace')}
                      onClick={() => {
                        dispatch({ type: 'showLeaveSpc' });
                        dispatch({ type: 'closeMobileSidebar' });
                      }}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom User Profile Summary */}
        {currUser && (
          <div className="w-full flex items-center justify-center xl:justify-start px-2 xl:px-4 py-3 border-t border-border-light dark:border-border-dark/60 mt-auto bg-background-light dark:bg-background-dark z-10 shrink-0">
            <Link
              to={`/u/${currUser.id}`}
              onClick={() => dispatch({ type: 'closeMobileSidebar' })}
              className="flex items-center w-full gap-3 overflow-hidden rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all p-1 xl:p-2"
            >
              <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
                {currUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col flex-1 min-w-0">
                <span className="font-bold text-[15px] truncate text-text-primary-light dark:text-text-primary-dark leading-tight">
                  {currUser.username}
                </span>
                <span className="text-text-secondary-light dark:text-text-secondary-dark text-[15px] truncate">
                  @{currUser.id.substring(0, 8)}
                </span>
              </div>
              <div className="hidden xl:block text-text-primary-light dark:text-text-primary-dark font-bold ml-auto px-1">
                ···
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export const ChatSidebar: React.FC<{ space?: Space }> = ({ space }) => {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex flex-col w-[290px] xl:w-[350px] shrink-0 h-screen sticky top-0 px-4 py-3 overflow-y-auto no-scrollbar pt-4">
      <div className="flex flex-col gap-4">
        {/* Following Section */}
        <div className="flex flex-col bg-surface-light dark:bg-[#16181c] border border-border-light dark:border-border-dark/60 rounded-2xl overflow-hidden pb-3">
          <h2 className="px-4 py-3 font-extrabold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            {t('user.following') || 'Following'}
          </h2>
          <div className="flex-1">
            <FollowedUsersList />
          </div>
        </div>

        {/* Spaces Section */}
        <div className="flex flex-col bg-surface-light dark:bg-[#16181c] border border-border-light dark:border-border-dark/60 rounded-2xl overflow-hidden pb-3">
          <h2 className="px-4 py-3 font-extrabold text-[20px] text-text-primary-light dark:text-text-primary-dark">
            {t('userProfile.spaces') || 'Spaces'}
          </h2>
          <div className="flex-1">
            <UserSpacesList />
          </div>
        </div>
      </div>
    </aside>
  );
};

// UI Helpers
const NavItem = ({
  icon,
  label,
  to,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    className="w-full flex items-center justify-start sm:justify-center xl:justify-start group py-1"
    onClick={onClick}
  >
    <div
      className={`flex items-center gap-5 xl:px-4 py-3 rounded-full transition-all group-hover:bg-black/10 dark:group-hover:bg-white/10 ${
        active
          ? 'font-bold text-text-primary-light dark:text-text-primary-dark'
          : 'text-text-primary-light dark:text-white/90'
      }`}
    >
      <div className="flex items-center justify-center h-[26px] w-[26px] shrink-0">{icon}</div>
      <span
        className={`inline sm:hidden xl:inline text-xl ${active ? 'font-bold' : 'font-normal'}`}
      >
        {label}
      </span>
    </div>
  </Link>
);

const SidebarItem = ({ icon, label, onClick, active, badge, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-start sm:justify-center xl:justify-start group py-1`}
  >
    <div
      className={`flex items-center gap-5 xl:px-4 py-3 rounded-full transition-all group-hover:bg-black/10 dark:group-hover:bg-white/10 ${
        active
          ? 'font-bold text-text-primary-light dark:text-text-primary-dark'
          : 'text-text-primary-light dark:text-white/90'
      } ${className}`}
    >
      <div className="flex items-center justify-center h-[26px] w-[26px] shrink-0 relative">
        {icon}
        {badge && (
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
            {badge}
          </div>
        )}
      </div>
      <span
        className={`inline sm:hidden xl:inline text-xl ${
          active ? 'font-bold' : 'font-normal'
        } truncate`}
      >
        {label}
      </span>
    </div>
  </button>
);

const SidebarThemeToggle = ({ onClick }: { onClick?: () => void }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        toggleTheme();
        if (onClick) onClick();
      }}
      className="w-full flex items-center justify-start sm:justify-center xl:justify-start group py-1 mt-2"
    >
      <div className="flex items-center gap-5 xl:px-4 py-3 rounded-full transition-all group-hover:bg-black/10 dark:group-hover:bg-white/10 text-text-primary-light dark:text-white/90">
        <div className="flex items-center justify-center h-[26px] w-[26px] shrink-0">
          {isDarkMode ? <MdOutlineDarkMode size={26} /> : <MdOutlineLightMode size={26} />}
        </div>
        <span className="inline sm:hidden xl:inline text-xl font-normal">Theme</span>
      </div>
    </button>
  );
};
