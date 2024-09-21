import { DefaultSpaceId, Space, SpaceMember } from '@nest/shared';
import { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { RiGroup2Fill } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useSideBarReducer } from '../hooks/sideBarReducer';
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
  const nav = useNavigate();

  const isMember = members?.some(member => member.memberId === currUser?.id);
  const isAdmin =
    space?.ownerId === currUser?.id ||
    members?.some(member => member.memberId === currUser?.id && member.isAdmin);

  return (
    <aside className="side-bar">
      <div className="side-bar-nav">
        <h3 hidden={!space} className="space-name">
          {space?.name}
        </h3>
        <button title='Show "list"' hidden={!space} onClick={() => setList(!list)}>
          {!list ? '🙈' : '🙉'}
        </button>
      </div>
      <button
        title='Create "Short"'
        hidden={!!space && !isMember}
        onClick={() => dispatch({ type: 'showCreateBlog' })}
        className={state.showCreateBlog ? 'active' : ''}
      >
        Short <FaPencilAlt size={20} color="#33872e" />
      </button>
      {state.showCreateBlog && <ShortForm />}

      <button
        title='Create "Blog"'
        hidden={(!!space && !isMember) || (space && !list)}
        onClick={() => nav(`/new/b/${space?.name || 'Default'}/${space?.id || DefaultSpaceId}`)}
      >
        Blog <TfiWrite size={20} color="#33872e" />
      </button>

      <button
        title='Create "space"'
        hidden={!!space}
        onClick={() => dispatch({ type: 'showCreateSpace' })}
        className={state.showCreateSpace ? 'active' : ''}
      >
        Space <RiGroup2Fill size={20} color="#33872e" />
      </button>
      {state.showCreateSpace && <CreateSpace />}

      <button
        title='Show "members"'
        hidden={!(!!space && isMember) || !list}
        onClick={() => dispatch({ type: 'showMembers' })}
        className={state.showMembers ? 'active' : ''}
      >
        members <IoIosPeople size={20} color="#33872e" />
      </button>
      {state.showMembers && list && <SpaceMembers space={space!} users={members!} />}

      <button
        title='Add "member"'
        hidden={!(!!space && isAdmin) || !list}
        onClick={() => dispatch({ type: 'showAddMember' })}
        className={state.showAddMember ? 'active' : ''}
      >
        add member
      </button>
      {state.showAddMember && list && <AddMember />}

      <button
        title='Edit "space"'
        hidden={!(!!space && isAdmin) || !list}
        onClick={() => dispatch({ type: 'showEditSpace' })}
        className={state.showEditSpace ? 'active' : ''}
      >
        edit space
      </button>
      {state.showEditSpace && list && <EditSpaceForm />}

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
        Chat {<NotificationMsgsNumber spaceId={space?.id!} />}
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
      {state.showLeaveSpc && list && <LeaveSpc dispatch={dispatch} spaceId={space?.id!} />}
    </aside>
  );
};
