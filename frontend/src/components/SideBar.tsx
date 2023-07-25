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
      <div className="side-bar-buttons-container">
        <button onClick={e => handleShowCreateSpace(e)}>Create Space</button>
        <button onClick={e => handleShowCreateBlog(e)}>Create Blog</button>
      </div>
      {showCreateSpace && <CreateSpaceForm />}
      {showCreateBlog && <CreateBlogForm />}
    </div>
  );
};
