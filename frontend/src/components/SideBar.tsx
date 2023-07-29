import { Space } from '@nest/shared';
import { FormEvent, useState } from 'react';

import '../styles/sidebar.css';
import { CreateBlogForm } from './CreateBlogForm';
import { CreateSpaceForm } from './CreateSpaceForm';

export const Sidebar: React.FC<{ space: Space }> = ({ space }) => {
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showEditSpace, setShowEditSpace] = useState(false);

  const handleShowCreateSpace = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowCreateSpace(!showCreateSpace);
    setShowCreateBlog(false);
  };
  const handleShowCreateBlog = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowCreateBlog(!showCreateBlog);
    setShowCreateSpace(false);
  };
  // const handleShowAddMember = (e: FormEvent | MouseEvent) => {
  //   e.preventDefault();
  //   setShowAddMember(!showAddMember);
  //   setShowMembers(false);
  //   setShowEditSpace(false);
  // };
  const handleShowMembers = (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    setShowMembers(!showMembers);
    setShowAddMember(false);
    setShowEditSpace(false);
  };
  // const handleShowEditSpace = (e: FormEvent | MouseEvent) => {
  //   e.preventDefault();
  //   setShowEditSpace(!showEditSpace);
  //   setShowAddMember(false);
  //   setShowMembers(false);
  // };

  return (
    <div className="side-bar">
      {space.id === '1' ? (
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
          <h3>{space.name}</h3>
          <button onClick={handleShowCreateBlog} className={showCreateBlog ? 'active' : ''}>
            Create Blog
          </button>
          <button onClick={handleShowMembers} className={showMembers ? 'active' : ''}>
            Show members
          </button>
          {
            //todo:
            // isAdmin() && <>
            //   <button onClick={handleShowAddMember} className={showAddMember ? 'active': ''}/>
            //   <button onClick={handleShowEditSpace} className={showEditSpace ? 'active': ''}/>
            // </>
          }

          {/* <button onClick={handleShowAddMember} className={showAddMember ? 'active' : ''} />
          <button onClick={handleShowEditSpace} className={showEditSpace ? 'active' : ''} /> */}
        </>
      )}

      {showCreateSpace && <CreateSpaceForm />}
      {showCreateBlog && <CreateBlogForm />}
      {showAddMember && <div>add member</div>}
      {showMembers && <div>members</div>}
      {showEditSpace && <div>edit space</div>}
    </div>
  );
};
