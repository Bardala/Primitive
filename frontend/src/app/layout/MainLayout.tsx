import { useSideBar } from '@/core/context/SideBarContext';
import { CreateSeriesModal } from '@/features/blog';
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

import { Space, SpaceMember } from '@nest/shared';

import React from 'react';
import { FaTimes } from 'react-icons/fa';

import { ActionsSidebar, ChatSidebar } from './SideBar';

interface MainLayoutProps {
  children: React.ReactNode;
  space?: Space;
  members?: SpaceMember[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, space, members }) => {
  const { state, dispatch } = useSideBar();

  const isChatActive = !!state.activeChatId;

  return (
    <div className="flex w-full justify-center lg:gap-6 xl:gap-8 max-w-[1265px] mx-auto overflow-x-hidden sm:overflow-visible min-h-screen">
      {/* Left Sidebar */}
      <ActionsSidebar space={space} members={members} />

      {/* Main Content Area */}
      <main className="flex-1 w-full sm:w-[600px] sm:max-w-[600px] border-r border-border-light dark:border-border-dark/60 min-h-screen pb-20 sm:pb-0 relative">
        {children}
      </main>

      {/* Right Sidebar */}
      <ChatSidebar space={space} />

      {/* Overlays / Modals for SideBar Actions */}
      {(state.showCreateBlog ||
        state.showCreateSeries ||
        state.showCreateSpace ||
        state.showMembers ||
        state.showAddMember ||
        state.showEditSpace ||
        (state.showChat && !isChatActive) || // Fallback modal
        state.showLeaveSpc ||
        state.showPermissions) && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => dispatch({ type: 'closeAll' })}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-light p-8 shadow-2xl dark:bg-surface-dark animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
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
              <CreateSeriesModal
                isOpen={state.showCreateSeries}
                onClose={() => dispatch({ type: 'closeAll' })}
              />
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
        <div className="fixed inset-0 z-100 bg-background-light dark:bg-background-dark lg:hidden animate-in slide-in-from-bottom duration-300">
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
    </div>
  );
};
