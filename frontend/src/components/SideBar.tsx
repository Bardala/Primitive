import { Space, SpaceMember } from '@nest/shared';
import { FormEvent, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { AddMember } from './AddMember';
import { Chat } from './Chat';
// import '../styles/sidebar.css';
import { CreateBlogForm } from './CreateBlogForm';
import { CreateSpace } from './CreateSpace';
import { EditSpaceForm } from './EditSpace';
import { SpaceMembers } from './SpaceMembers';

export const Sidebar: React.FC<{ space: Space; members?: SpaceMember[] }> = ({
  space,
  members,
}) => {
  const { currUser } = useAuthContext();
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showEditSpace, setShowEditSpace] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleShowCreateSpace = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowCreateSpace(!showCreateSpace);
    setShowCreateBlog(false);
    setShowChat(false);
  };
  const handleShowCreateBlog = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowCreateBlog(!showCreateBlog);
    setShowCreateSpace(false);
    setShowMembers(false);
    setShowChat(false);
  };
  const handleShowAddMember = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowAddMember(!showAddMember);
    setShowMembers(false);
    setShowEditSpace(false);
    setShowChat(false);
  };
  const handleShowMembers = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowCreateBlog(false);
    setShowMembers(!showMembers);
    setShowAddMember(false);
    setShowEditSpace(false);
    setShowChat(false);
  };
  const handleShowChat = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowChat(!showChat);
    setShowCreateBlog(false);
    setShowMembers(false);
    setShowAddMember(false);
    setShowEditSpace(false);
  };

  const handleShowEditSpace = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowEditSpace(!showEditSpace);
    setShowAddMember(false);
    setShowMembers(false);
    setShowChat(false);
  };

  const isMember = members?.some(member => member.memberId === currUser?.id);

  const isAdmin = () => {
    if (space.ownerId === currUser?.id) return true;
    return members?.some(member => member.memberId === currUser?.id && member.isAdmin);
  };
  const isDefaultSpace = space?.id === '1';

  return (
    <div className="side-bar">
      {isDefaultSpace ? (
        <>
          <button onClick={handleShowCreateBlog} className={showCreateBlog ? 'active' : ''}>
            Create Blog
          </button>
          {showCreateBlog && <CreateBlogForm />}

          <button onClick={handleShowCreateSpace} className={showCreateSpace ? 'active' : ''}>
            Create Space
          </button>
          {showCreateSpace && <CreateSpace />}
        </>
      ) : (
        <>
          <h3>{space?.name}</h3>
          {isMember && (
            <>
              <button onClick={handleShowCreateBlog} className={showCreateBlog ? 'active' : ''}>
                Create Blog
              </button>
              {showCreateBlog && <CreateBlogForm />}
              <button onClick={handleShowMembers} className={showMembers ? 'active' : ''}>
                Show members
              </button>
              {showMembers && <SpaceMembers users={members!} />}
            </>
          )}
          {
            //todo:
            isAdmin() && (
              <>
                <button onClick={handleShowAddMember} className={showAddMember ? 'active' : ''}>
                  add member
                </button>
                {showAddMember && <AddMember />}
                <button onClick={handleShowEditSpace} className={showEditSpace ? 'active' : ''}>
                  edit space
                </button>
                {showEditSpace && <EditSpaceForm />}
              </>
            )
          }

          {/* <button onClick={handleShowAddMember} className={showAddMember ? 'active' : ''} />
          <button onClick={handleShowEditSpace} className={showEditSpace ? 'active' : ''} /> */}

          {/* //todo: create space chat */}
          <button className="chat-button" onClick={handleShowChat}>
            Chat
          </button>
          {showChat && <Chat space={space} />}
        </>
      )}
    </div>
  );
};
