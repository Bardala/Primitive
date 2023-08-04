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
      {!space ? (
        <>
          <button
            onClick={() => dispatch({ type: 'showCreateBlog' })}
            className={state.showCreateBlog ? 'active' : ''}
          >
            Create Micro Blog
          </button>
          {state.showCreateBlog && <CreateBlogForm />}

          <button onClick={() => nav(`/new/b/Default/${DefaultSpaceId}`)}>
            Create Blog with preview
          </button>

          <button
            onClick={() => dispatch({ type: 'showCreateSpace' })}
            className={state.showCreateSpace ? 'active' : ''}
          >
            Create Space
          </button>
          {state.showCreateSpace && <CreateSpace />}
        </>
      ) : (
        <>
          <h3>{space?.name}</h3>
          {isMember && (
            <>
              <button
                onClick={() => dispatch({ type: 'showCreateBlog' })}
                className={state.showCreateBlog ? 'active' : ''}
              >
                Create Blog
              </button>
              {state.showCreateBlog && <CreateBlogForm />}

              <button
                onClick={() => nav(`/new/b/${(space! as Space).name}/${(space! as Space)?.id!}`)}
              >
                Create Blog with preview
              </button>

              <button
                onClick={() => dispatch({ type: 'showMembers' })}
                className={state.showMembers ? 'active' : ''}
              >
                Show members
              </button>
              {state.showMembers && <SpaceMembers users={members!} />}
            </>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => dispatch({ type: 'showAddMember' })}
                className={state.showAddMember ? 'active' : ''}
              >
                add member
              </button>
              {state.showAddMember && <AddMember />}
              <button
                onClick={() => dispatch({ type: 'showEditSpace' })}
                className={state.showEditSpace ? 'active' : ''}
              >
                edit space
              </button>
              {state.showEditSpace && <EditSpaceForm />}
            </>
          )}

          <button className="chat-button" onClick={() => dispatch({ type: 'showChat' })}>
            Chat
          </button>
          {state.showChat && <Chat space={space!} />}
        </>
      )}
    </div>
  );
};
