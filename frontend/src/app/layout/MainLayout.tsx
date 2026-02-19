import { useSideBar } from '@/core/context/SideBarContext';
import { Chat, PrivateChatWindow } from '@/features/chat';
import { ShortForm } from '@/features/short-form';
import {
  AddMember,
  CreateSpace,
  EditSpaceForm,
  LeaveSpc,
  SpaceMembers,
  SpacePermissions,
} from '@/features/spaces';

import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';

import React from 'react';
import { FaComments, FaPencilAlt, FaPlus, FaTimes, FaTools } from 'react-icons/fa';
import { RiGroup2Fill } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';

import { ActionsSidebar, ChatSidebar } from './SideBar';

interface MainLayoutProps {
  children: React.ReactNode;
  space?: Space;
  members?: SpaceMember[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, space, members }) => {
  const { state, dispatch } = useSideBar();
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isChatActive = !!state.activeChatId;

  // Close mobile menu when an action is taken
  const handleAction = (type: any) => {
    dispatch({ type });
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex w-full overflow-x-hidden">
      {/* Left Sidebar */}
      <ActionsSidebar space={space} members={members} />

      {/* Main Content Area */}
      <main
        className={`min-w-0 flex-1 px-4 py-8 sm:px-6 transition-all duration-300 ${
          isChatActive ? 'lg:mr-0' : ''
        }`}
      >
        {children}
      </main>

      {/* Right Sidebar */}
      <ChatSidebar space={space} />

      {/* Overlays / Modals for SideBar Actions */}
      {(state.showCreateBlog ||
        state.showCreateSpace ||
        state.showMembers ||
        state.showAddMember ||
        state.showEditSpace ||
        (state.showChat && !isChatActive) || // Fallback modal
        state.showLeaveSpc ||
        state.showPermissions) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-light p-8 shadow-2xl dark:bg-surface-dark animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                dispatch({ type: 'closeAll' });
              }}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-background-light text-text-secondary-light transition-all hover:bg-gray-100 hover:text-red-500 dark:bg-background-dark dark:text-text-secondary-dark dark:hover:bg-white/10"
            >
              <FaTimes />
            </button>

            <div className="mt-2">
              {state.showCreateBlog && <ShortForm />}
              {state.showCreateSpace && <CreateSpace />}
              {state.showMembers && space && members && (
                <SpaceMembers space={space} users={members} />
              )}
              {state.showAddMember && <AddMember />}
              {state.showEditSpace && <EditSpaceForm />}
              {state.showChat && space && <Chat space={space} />}
              {state.showLeaveSpc && space && <LeaveSpc dispatch={dispatch} spaceId={space.id} />}
              {state.showPermissions && space && <SpacePermissions spaceId={space.id} />}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Chat Overlay - Creative Experience */}
      {state.showChat && isChatActive && (
        <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark lg:hidden animate-in slide-in-from-bottom duration-300">
          <div className="flex h-full flex-col">
            <header className="flex h-16 items-center border-b border-border-light bg-surface-light px-4 dark:border-border-dark dark:bg-surface-dark">
              <button
                onClick={() =>
                  dispatch({ type: 'setActiveChat', payload: { id: null, type: null } })
                }
                className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-background-light text-primary-600 dark:bg-background-dark"
              >
                <FaTimes />
              </button>
              <h3 className="font-bold text-lg">{state.activeChatName || 'Chat'}</h3>
            </header>
            <div className="flex-1 overflow-hidden">
              {state.activeChatType === 'space' ? (
                <Chat space={space || ({ id: state.activeChatId } as any)} />
              ) : (
                <PrivateChatWindow
                  conversationId={state.activeChatId!}
                  recipientName={state.activeChatName || 'User'}
                  onBack={() =>
                    dispatch({ type: 'setActiveChat', payload: { id: null, type: null } })
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Action Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="absolute bottom-24 right-6 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-4 duration-300">
            {/* Action Buttons */}
            <MobileMenuButton
              icon={<FaPencilAlt size={18} />}
              label="Short Form"
              onClick={() => handleAction('showCreateBlog')}
            />
            <MobileMenuButton
              icon={<TfiWrite size={18} />}
              label="Blog Post"
              onClick={() => {
                nav(`/new/b/${space?.name || 'Default'}/${space?.id || DefaultSpaceId}`);
                setMobileMenuOpen(false);
              }}
            />
            {!space && (
              <MobileMenuButton
                icon={<RiGroup2Fill size={20} />}
                label="Create Space"
                onClick={() => handleAction('showCreateSpace')}
              />
            )}
            {space && (
              <MobileMenuButton
                icon={<FaComments size={18} />}
                label="Space Chat"
                onClick={() => handleAction('showChat')}
              />
            )}
            {space && (
              <MobileMenuButton
                icon={<FaTools size={18} />}
                label="Management"
                onClick={() => handleAction('showMembers')}
              />
            )}
          </div>
          <div className="absolute inset-0 z-[-1]" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Action Trigger */}
      <button
        className={`fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg transition-all duration-300 hover:scale-110 lg:hidden ${
          mobileMenuOpen ? 'rotate-45 scale-90' : ''
        }`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
};

const MobileMenuButton = ({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 rounded-2xl bg-surface-light px-4 py-3 text-sm font-bold text-text-primary-light shadow-xl transition-all hover:bg-gray-50 active:scale-95 dark:bg-surface-dark dark:text-text-primary-dark"
  >
    <span className="text-primary-600 dark:text-primary-400">{icon}</span>
    <span>{label}</span>
  </button>
);
