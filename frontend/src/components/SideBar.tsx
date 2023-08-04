import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useSideBarReducer } from '../hooks/sideBarReducer';
import { AddMember } from './AddMember';
import { Chat } from './Chat';
// import '../styles/sidebar.css';
import { CreateBlogForm } from './CreateBlogForm';
import { CreateSpace } from './CreateSpace';
import { EditSpaceForm } from './EditSpace';
import { SpaceMembers } from './SpaceMembers';

export const Sidebar: React.FC<{ space?: Space; members?: SpaceMember[] }> = ({
  space,
  members,
}) => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSideBarReducer();
  const nav = useNavigate();

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  return (
    <div className="side-bar">
      {
        <>
          <h3 hidden={!space} className="space-name">
            {space?.name}
          </h3>
          <button
            hidden={!!space && !isMember}
            onClick={() => dispatch({ type: 'showCreateBlog' })}
            className={state.showCreateBlog ? 'active' : ''}
          >
            Create Micro Blog
          </button>
          {state.showCreateBlog && <CreateBlogForm />}

          <button
            hidden={!!space && !isMember}
            onClick={() => nav(`/new/b/Default/${DefaultSpaceId}`)}
          >
            Create Blog with preview
          </button>

          <button
            hidden={!!space}
            onClick={() => dispatch({ type: 'showCreateSpace' })}
            className={state.showCreateSpace ? 'active' : ''}
          >
            Create Space
          </button>
          {state.showCreateSpace && <CreateSpace />}

          <button
            hidden={!(!!space && isMember)}
            onClick={() => dispatch({ type: 'showMembers' })}
            className={state.showMembers ? 'active' : ''}
          >
            Show members
          </button>
          {state.showMembers && <SpaceMembers users={members!} />}

          <button
            hidden={!(!!space && isAdmin)}
            onClick={() => dispatch({ type: 'showAddMember' })}
            className={state.showAddMember ? 'active' : ''}
          >
            add member
          </button>
          {state.showAddMember && <AddMember />}
          <button
            hidden={!(!!space && isAdmin)}
            onClick={() => dispatch({ type: 'showEditSpace' })}
            className={state.showEditSpace ? 'active' : ''}
          >
            edit space
          </button>
          {state.showEditSpace && <EditSpaceForm />}

          {/**(if space exists, and if isMember) it will be visible */}
          <button
            hidden={!(!!space && isMember)}
            className="chat-button"
            onClick={() => dispatch({ type: 'showChat' })}
          >
            Chat
          </button>
          {state.showChat && <Chat space={space!} />}
          {/** //todo: hide all buttons while chat */}
        </>
      }
    </div>
  );
};
