import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { RiGroup2Fill } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useSideBarReducer } from '../hooks/sideBarReducer';
import '../styles/sidebar.css';
import { AddMember } from './AddMember';
import { Chat } from './Chat';
import { CreateSpace } from './CreateSpace';
import { EditSpaceForm } from './EditSpace';
import { LeaveSpc } from './LeaveSpc';
import { NotificationMsgsNumber } from './NotificationNumberMsgs';
import { ShortForm } from './ShortForm';
import { SpaceMembers } from './SpaceMembers';

export const ActionBar: React.FC<{
  space?: Space;
  members?: SpaceMember[];
  numOfUnReadingMsgs?: number;
}> = ({ space, members, numOfUnReadingMsgs = 0 }) => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSideBarReducer();
  const { t } = useTranslation();
  const [list, setList] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const nav = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.floating-sidebar-toggle')
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="floating-sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={t('sidebar.toggle')}
      >
        {isSidebarOpen ? <FaTimes /> : <FaPlus />}
        {numOfUnReadingMsgs > 0 && (
          <span className="notification-badge floating-badge">
            {numOfUnReadingMsgs > 99 ? '99+' : numOfUnReadingMsgs}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{ opacity: 1, visibility: 'visible' }}
        ></div>
      )}

      <aside ref={sidebarRef} className={`action-bar ${isSidebarOpen ? 'open' : ''}`}>
        {space && (
          <div className="action-bar-header">
            {isMember && (
              <div className="action-bar-nav">
                <h3 className="space-name">{space?.name}</h3>
                <button
                  title={t('sidebar.toggleList')}
                  onClick={() => setList(!list)}
                  className="toggle-list-btn"
                >
                  {!list ? '🙈' : '🙉'}
                </button>
              </div>
            )}

            <div className="space-info">
              <div className="space-members-count">
                <IoIosPeople size={16} />
                <span>{t('sidebar.membersCount', { count: members?.length || 0 })}</span>
              </div>
            </div>
          </div>
        )}

        <div className="action-bar-content">
          <div className="action-buttons">
            {!(!!space && !isMember) && (
              <button
                title={t('sidebar.createShort')}
                onClick={() => dispatch({ type: 'showCreateBlog' })}
                className={`action-btn ${state.showCreateBlog ? 'active' : ''}`}
              >
                <span className="btn-icon">
                  <FaPencilAlt size={18} />
                </span>
                <span className="btn-text">{t('sidebar.short')}</span>
              </button>
            )}

            {!((!!space && !isMember) || (space && !list)) && (
              <button
                title={t('sidebar.createBlog')}
                onClick={() => {
                  nav(`/new/b/${space?.name || 'Default'}/${space?.id || DefaultSpaceId}`);
                  closeSidebar();
                }}
                className="action-btn"
              >
                <span className="btn-icon">
                  <TfiWrite size={18} />
                </span>
                <span className="btn-text">{t('sidebar.blog')}</span>
              </button>
            )}

            {!!space && isMember && (
              <button
                title={t('sidebar.showChat')}
                className="chat-btn"
                onClick={() => {
                  dispatch({ type: 'showChat' });
                  setList(false);
                }}
              >
                <span className="btn-icon">💬</span>
                <span className="btn-text">{t('sidebar.chat')}</span>
                <NotificationMsgsNumber spaceId={space?.id!} />
              </button>
            )}

            {!space && (
              <button
                title={t('sidebar.createSpace')}
                onClick={() => dispatch({ type: 'showCreateSpace' })}
                className={`action-btn ${state.showCreateSpace ? 'active' : ''}`}
              >
                <span className="btn-icon">
                  <RiGroup2Fill size={18} />
                </span>
                <span className="btn-text">{t('sidebar.space')}</span>
              </button>
            )}
          </div>

          {list && space && isMember && (
            <div className="space-management">
              <h4 className="management-title">{t('sidebar.management')}</h4>

              <button
                title={t('sidebar.showMembers')}
                onClick={() => dispatch({ type: 'showMembers' })}
                className={`management-btn ${state.showMembers ? 'active' : ''}`}
              >
                <span className="btn-icon">
                  <IoIosPeople size={18} />
                </span>
                <span className="btn-text">{t('sidebar.members')}</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    title={t('sidebar.addMember')}
                    onClick={() => dispatch({ type: 'showAddMember' })}
                    className={`management-btn ${state.showAddMember ? 'active' : ''}`}
                  >
                    <span className="btn-icon">+</span>
                    <span className="btn-text">{t('sidebar.addMember')}</span>
                  </button>

                  <button
                    title={t('sidebar.editSpace')}
                    onClick={() => dispatch({ type: 'showEditSpace' })}
                    className={`management-btn ${state.showEditSpace ? 'active' : ''}`}
                  >
                    <span className="btn-icon">✏️</span>
                    <span className="btn-text">{t('sidebar.editSpace')}</span>
                  </button>
                </>
              )}

              <button
                title={t('sidebar.leaveSpace')}
                onClick={() => dispatch({ type: 'showLeaveSpc' })}
                className="management-btn leave-btn"
              >
                <span className="btn-icon">🚪</span>
                <span className="btn-text">{t('sidebar.leaveSpace')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modals and Forms */}
        {state.showCreateBlog && <ShortForm />}
        {state.showCreateSpace && <CreateSpace />}
        {state.showMembers && list && <SpaceMembers space={space!} users={members!} />}
        {state.showAddMember && list && <AddMember />}
        {state.showEditSpace && list && <EditSpaceForm />}
        {state.showChat && <Chat space={space!} />}
        {state.showLeaveSpc && list && <LeaveSpc dispatch={dispatch} spaceId={space?.id!} />}
      </aside>
    </>
  );
};
