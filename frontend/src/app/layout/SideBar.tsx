import { useAuthContext } from '@/core/context';
import { useSideBar } from '@/core/context/SideBarContext';
import { ROUTES } from '@/core/utils';
import { NotificationMsgsNumber } from '@/features/notification/components';
import { FollowedUsersList } from '@/features/user/components';

import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaComments, FaPencilAlt, FaPlus, FaUserFriends } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { IoIosPeople } from 'react-icons/io';
import { RiGroup2Fill } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import { useLocation, useNavigate } from 'react-router-dom';

import { UserSpacesList } from '../../features/spaces/components/UserSpacesList';

export const ActionsSidebar: React.FC<{
  space?: Space;
  members?: SpaceMember[];
}> = ({ space, members }) => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSideBar();
  const { t } = useTranslation();
  const nav = useNavigate();

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-72 flex-col gap-6 overflow-y-auto bg-surface-light p-6 transition-all dark:bg-night-mid/40 dark:backdrop-blur-lg dark:border-r dark:border-white/5 lg:flex">
      {space && (
        <div className="flex flex-col gap-2 rounded-2xl bg-background-light p-4 dark:bg-background-dark/50 shadow-inner">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-lg font-bold text-primary-600 dark:text-primary-400">
              {space?.name}
            </h3>
            <button
              onClick={() =>
                dispatch({
                  type: 'setActiveChat',
                  payload: { id: space.id, type: 'space', name: space.name },
                })
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-light text-primary-600 transition-all hover:bg-primary-50 active:scale-95 dark:bg-surface-dark dark:text-primary-400 dark:hover:bg-primary-900/30"
              title={t('sidebar.chat')}
            >
              <FaComments size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
            <IoIosPeople size={14} />
            <span>{t('sidebar.membersCount', { count: members?.length || 0 })}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <SidebarButton
          icon={<FaPencilAlt size={16} />}
          label={t('sidebar.short')}
          onClick={() => dispatch({ type: 'showCreateBlog' })}
          active={state.showCreateBlog}
        />

        <SidebarButton
          icon={<TfiWrite size={16} />}
          label={t('sidebar.blog')}
          onClick={() => nav(`/new/b/${space?.name || 'Default'}/${space?.id || DefaultSpaceId}`)}
        />

        {!!space && isMember && (
          <SidebarButton
            icon={<span className="text-xl">💬</span>}
            label={t('sidebar.chat')}
            onClick={() => dispatch({ type: 'showChat' })}
            active={state.showChat}
            badge={<NotificationMsgsNumber spaceId={space?.id!} />}
            variant="gradient"
          />
        )}

        {!space && (
          <SidebarButton
            icon={<RiGroup2Fill size={18} />}
            label={t('sidebar.space')}
            onClick={() => dispatch({ type: 'showCreateSpace' })}
            active={state.showCreateSpace}
          />
        )}
      </div>

      {space && isMember && (
        <div className="flex flex-col gap-2 border-t border-border-light pt-6 dark:border-border-dark">
          <h4 className="px-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
            {t('sidebar.management')}
          </h4>

          <SidebarSubButton
            label={t('sidebar.members')}
            icon={<IoIosPeople size={16} />}
            onClick={() => dispatch({ type: 'showMembers' })}
            active={state.showMembers}
          />

          {isAdmin && (
            <>
              <SidebarSubButton
                label={t('sidebar.addMember')}
                icon={<FaPlus size={12} />}
                onClick={() => dispatch({ type: 'showAddMember' })}
                active={state.showAddMember}
              />
              <SidebarSubButton
                label={t('sidebar.editSpace')}
                icon={<span>✏️</span>}
                onClick={() => dispatch({ type: 'showEditSpace' })}
                active={state.showEditSpace}
              />
              <SidebarSubButton
                label="Permissions"
                icon={<span>🔒</span>}
                onClick={() => dispatch({ type: 'showPermissions' })}
                active={state.showPermissions}
              />
            </>
          )}

          <button
            onClick={() => dispatch({ type: 'showLeaveSpc' })}
            className="mt-2 flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <span>🚪</span>
            <span>{t('sidebar.leaveSpace')}</span>
          </button>
        </div>
      )}

      {/* Conditional rendering for forms in sidebar or modal? 
          For now, let's keep them as modals or separate components in the main area.
          But user said "put it in a side". Let's show the forms in a modal for now, 
          or we can render them in the main area.
      */}
    </aside>
  );
};

export const ChatSidebar: React.FC<{ space?: Space }> = ({ space }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isHomePage = location.pathname === ROUTES.HOME;

  if (!isHomePage) {
    return null;
  }

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] overflow-hidden border-l border-border-light bg-surface-light transition-all duration-300 dark:border-white/5 dark:bg-night-mid/40 dark:backdrop-blur-lg lg:flex lg:flex-col w-80">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Following Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex items-center gap-3 border-b border-border-light p-5 dark:border-border-dark bg-gray-50/50 dark:bg-white/5 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
              <FaUserFriends size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black tracking-tight text-text-primary-light dark:text-text-primary-dark uppercase leading-none">
                {t('user.following') || 'Following'}
              </h3>
              <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest opacity-80 mt-1">
                Active Network
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <FollowedUsersList />
          </div>

          {/* Spaces Section */}
          <div className="flex items-center gap-3 border-y border-border-light p-5 dark:border-border-dark bg-gray-50/50 dark:bg-white/5 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <FiUsers size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black tracking-tight text-text-primary-light dark:text-text-primary-dark uppercase leading-none">
                {t('userProfile.spaces') || 'Spaces'}
              </h3>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest opacity-80 mt-1">
                Your Communities
              </span>
            </div>
          </div>
          <div className="flex-1">
            <UserSpacesList />
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarButton = ({
  icon,
  label,
  onClick,
  active,
  badge,
  variant = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  badge?: React.ReactNode;
  variant?: 'default' | 'gradient';
}) => (
  <button
    onClick={onClick}
    className={`group relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
      variant === 'gradient'
        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md hover:shadow-lg active:scale-95'
        : active
        ? 'bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800/50'
        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark'
    }`}
  >
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
        variant === 'gradient'
          ? 'bg-white/20'
          : active
          ? 'bg-primary-100 dark:bg-primary-900/40'
          : 'bg-gray-100 dark:bg-white/5'
      }`}
    >
      {icon}
    </span>
    <span className="flex-1 text-sm font-bold tracking-tight">{label}</span>
    {badge && <div className="shrink-0">{badge}</div>}
  </button>
);

const SidebarSubButton = ({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
      active
        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
        : 'text-text-secondary-light hover:bg-gray-50 dark:text-text-secondary-dark dark:hover:bg-white/5'
    }`}
  >
    <span className="shrink-0 opacity-70">{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

// SideBar.tsx finished
