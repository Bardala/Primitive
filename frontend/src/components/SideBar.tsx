import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useSideBarReducer } from '../hooks/sideBarReducer';
import { AddMember } from './AddMember';
import { Chat } from './Chat';
import { CreateSpace } from './CreateSpace';
import { EditSpaceForm } from './EditSpace';
import { LeaveSpc } from './LeaveSpc';
import { ShortForm } from './ShortForm';
import { SpaceMembers } from './SpaceMembers';

export const Sidebar: React.FC<{ space?: Space; members?: SpaceMember[] }> = ({
  space,
  members,
}) => {
  const { currUser } = useAuthContext();
  const { state, dispatch } = useSideBarReducer();
  const [list, setList] = useState(false);
  const nav = useNavigate();

  console.log(state.showLeaveSpc);

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  return (
    <div className="side-bar">
      <div className="side-bar-nav">
        <h3 hidden={!space} className="space-name">
          {space?.name}
        </h3>
        <button title='Show "list"' hidden={!space} onClick={() => setList(!list)}>
          {!list ? '🙈' : '🙉'}
        </button>
      </div>
      <button
        title='Create "short"'
        hidden={!!space && !isMember}
        onClick={() => dispatch({ type: 'showCreateBlog' })}
        className={state.showCreateBlog ? 'active' : ''}
      >
        Create Short
      </button>
      {state.showCreateBlog && <ShortForm />}

      <button
        title='Create "blog"'
        hidden={(!!space && !isMember) || (space && !list)}
        onClick={() => nav(`/new/b/${space?.name || 'Default'}/${space?.id || DefaultSpaceId}`)}
      >
        Create Blog
      </button>

      <button
        title='Create "space"'
        hidden={!!space}
        onClick={() => dispatch({ type: 'showCreateSpace' })}
        className={state.showCreateSpace ? 'active' : ''}
      >
        Create Space
      </button>
      {state.showCreateSpace && <CreateSpace />}

      <button
        title='Show "members"'
        hidden={!(!!space && isMember) || !list}
        onClick={() => dispatch({ type: 'showMembers' })}
        className={state.showMembers ? 'active' : ''}
      >
        Show members
      </button>
      {state.showMembers && <SpaceMembers space={space!} users={members!} />}

      <button
        title='Add "member"'
        hidden={!(!!space && isAdmin) || !list}
        onClick={() => dispatch({ type: 'showAddMember' })}
        className={state.showAddMember ? 'active' : ''}
      >
        add member
      </button>
      {state.showAddMember && <AddMember />}

      <button
        title='Edit "space"'
        hidden={!(!!space && isAdmin) || !list}
        onClick={() => dispatch({ type: 'showEditSpace' })}
        className={state.showEditSpace ? 'active' : ''}
      >
        edit space
      </button>
      {state.showEditSpace && <EditSpaceForm />}

      {/**(if space exists, and if isMember) it will be visible */}
      <button
        title='Show "chat"'
        hidden={!(!!space && isMember)}
        className="chat-button" // todo: edit this
        onClick={() => {
          dispatch({ type: 'showChat' });
          setList(false);
        }}
      >
        Chat
      </button>
      {state.showChat && <Chat space={space!} />}

      <button
        title="leave space"
        hidden={!(!!space && isMember) || !list}
        onClick={() => dispatch({ type: 'showLeaveSpc' })}
        className={state.showLeaveSpc ? 'active' : ''}
      >
        Leave Space
      </button>
      {state.showLeaveSpc && <LeaveSpc dispatch={dispatch} spaceId={space?.id!} />}
    </div>
  );
};
