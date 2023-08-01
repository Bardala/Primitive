import { Space, SpaceMember } from '@nest/shared';
import { FormEvent, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
// import '../styles/sidebar.css';
import { CreateBlogForm } from './CreateBlogForm';
import { CreateSpaceForm } from './CreateSpaceForm';
import { SpaceMembers } from './SpaceMembers';
import { Chat } from './Chat';

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
  // const handleShowAddMember = (e: FormEvent | MouseEvent) => {
  //   e.preventDefault();
  //   setShowAddMember(!showAddMember);
  //   setShowMembers(false);
  //   setShowEditSpace(false);
  // };
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

  // const handleShowEditSpace = (e: FormEvent | MouseEvent) => {
  //   e.preventDefault();
  //   setShowEditSpace(!showEditSpace);
  //   setShowAddMember(false);
  //   setShowMembers(false);
  // };

  const isMember = () => {
    return members?.some(member => member.memberId === currUser?.id);
  };
  const isDefaultSpace = space?.id === '1';

  return (
    <div className="side-bar">
      {isDefaultSpace ? (
        <>
          <button onClick={handleShowCreateBlog} className={showCreateBlog ? 'active' : ''}>
            Create Blog
          </button>

          <button onClick={handleShowCreateSpace} className={showCreateSpace ? 'active' : ''}>
            Create Space
          </button>
        </>
      ) : (
        <>
          <h3>{space?.name}</h3>
          {isMember() && (
            <>
              <button onClick={handleShowCreateBlog} className={showCreateBlog ? 'active' : ''}>
                Create Blog
              </button>
              <button onClick={handleShowMembers} className={showMembers ? 'active' : ''}>
                Show members
              </button>
            </>
          )}
          {
            //todo:
            // isAdmin() && <>
            //   <button onClick={handleShowAddMember} className={showAddMember ? 'active': ''}/>
            //   <button onClick={handleShowEditSpace} className={showEditSpace ? 'active': ''}/>
            // </>
          }

          {/* <button onClick={handleShowAddMember} className={showAddMember ? 'active' : ''} />
          <button onClick={handleShowEditSpace} className={showEditSpace ? 'active' : ''} /> */}

          {/* //todo: create space chat */}
          <button className="chat-button" onClick={handleShowChat}>
            Chat
          </button>
        </>
      )}

      {showCreateSpace && <CreateSpaceForm />}
      {showCreateBlog && <CreateBlogForm />}
      {showAddMember && <div>add member</div>}
      {showMembers && <SpaceMembers users={members!} />}
      {showEditSpace && <div>edit space</div>}
      {showChat && <Chat space={space}/>}
    </div>
  );
};
