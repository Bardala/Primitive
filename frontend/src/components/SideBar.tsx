import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';
import { useEffect, useRef, useState } from 'react';
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

export const Sidebar: React.FC<{
  space?: Space;
  members?: SpaceMember[];
  numOfUnReadingMsgs?: number;
}> = ({ space, members }) => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSideBarReducer();
  const [list, setList] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const nav = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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
      {/* Floating toggle button for all screens */}
      <button
        className="floating-sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FaTimes /> : <FaPlus />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{ opacity: 1, visibility: 'visible' }}
        ></div>
      )}

      <aside ref={sidebarRef} className={`side-bar ${isSidebarOpen ? 'open' : ''}`}>
        {space && (
          <div className="side-bar-header">
            {isMember && (
              <div className="side-bar-nav">
                <h3 className="space-name">{space?.name}</h3>
                <button
                  title='Show "list"'
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
                <span>{members?.length || 0} members</span>
              </div>
            </div>
          </div>
        )}

        <div className="side-bar-content">
          <div className="action-buttons">
            {!(!!space && !isMember) && (
              <button
                title='Create "Short"'
                onClick={() => {
                  dispatch({ type: 'showCreateBlog' });
                }}
                className={`action-btn ${state.showCreateBlog ? 'active' : ''}`}
              >
                <span className="btn-icon">
                  <FaPencilAlt size={18} />
                </span>
                <span className="btn-text">Short</span>
              </button>
            )}

            {!((!!space && !isMember) || (space && !list)) && (
              <button
                title='Create "Blog"'
                onClick={() => {
                  nav(`/new/b/${space?.name || 'Default'}/${space?.id || DefaultSpaceId}`);
                  closeSidebar();
                }}
                className="action-btn"
              >
                <span className="btn-icon">
                  <TfiWrite size={18} />
                </span>
                <span className="btn-text">Blog</span>
              </button>
            )}

            {!!space && isMember && (
              <button
                title='Show "chat"'
                className="chat-btn"
                onClick={() => {
                  dispatch({ type: 'showChat' });
                  setList(false);
                }}
              >
                <span className="btn-icon">💬</span>
                <span className="btn-text">Chat</span>
                <NotificationMsgsNumber spaceId={space?.id!} />
              </button>
            )}

            {!space && (
              <button
                title='Create "space"'
                onClick={() => {
                  dispatch({ type: 'showCreateSpace' });
                }}
                className={`action-btn ${state.showCreateSpace ? 'active' : ''}`}
              >
                <span className="btn-icon">
                  <RiGroup2Fill size={18} />
                </span>
                <span className="btn-text">Space</span>
              </button>
            )}
          </div>

          {list && space && isMember && (
            <div className="space-management">
              <h4 className="management-title">Space Management</h4>

              <button
                title='Show "members"'
                onClick={() => {
                  dispatch({ type: 'showMembers' });
                }}
                className={`management-btn ${state.showMembers ? 'active' : ''}`}
              >
                <span className="btn-icon">
                  <IoIosPeople size={18} />
                </span>
                <span className="btn-text">Members</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    title='Add "member"'
                    onClick={() => {
                      dispatch({ type: 'showAddMember' });
                    }}
                    className={`management-btn ${state.showAddMember ? 'active' : ''}`}
                  >
                    <span className="btn-icon">+</span>
                    <span className="btn-text">Add Member</span>
                  </button>

                  <button
                    title='Edit "space"'
                    onClick={() => {
                      dispatch({ type: 'showEditSpace' });
                    }}
                    className={`management-btn ${state.showEditSpace ? 'active' : ''}`}
                  >
                    <span className="btn-icon">✏️</span>
                    <span className="btn-text">Edit Space</span>
                  </button>
                </>
              )}

              <button
                title="leave space"
                onClick={() => {
                  dispatch({ type: 'showLeaveSpc' });
                }}
                className="management-btn leave-btn"
              >
                <span className="btn-icon">🚪</span>
                <span className="btn-text">Leave Space</span>
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
