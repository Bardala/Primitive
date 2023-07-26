import { FormEvent, useState } from 'react';

import '../styles/sidebar.css';
import { CreateBlogForm } from './CreateBlogForm';
import { CreateSpaceForm } from './CreateSpaceForm';

export const Sidebar = () => {
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);

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

  return (
    <div className="side-bar">
      <button onClick={handleShowCreateSpace} className={showCreateSpace ? 'active' : ''}>
        Create Space
      </button>
      <button onClick={handleShowCreateBlog} className={showCreateBlog ? 'active' : ''}>
        Create Blog
      </button>

      {showCreateSpace && <CreateSpaceForm />}
      {showCreateBlog && <CreateBlogForm />}
    </div>
  );
};
