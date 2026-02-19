import { Dispatch, useReducer } from 'react';

interface State {
  showCreateSpace: boolean;
  showCreateBlog: boolean;
  showAddMember: boolean;
  showMembers: boolean;
  showEditSpace: boolean;
  showChat: boolean;
  showLeaveSpc: boolean;
  showPermissions: boolean;
  hideAll: boolean;
  activeChatId?: string | null;
  activeChatType?: 'private' | 'space' | null;
  activeChatName?: string | null;
}

export type SideBarAction =
  | { type: 'showCreateBlog' }
  | { type: 'showCreateSpace' }
  | { type: 'showAddMember' }
  | { type: 'showMembers' }
  | { type: 'showEditSpace' }
  | { type: 'showChat' }
  | { type: 'showLeaveSpc' }
  | { type: 'showPermissions' }
  | { type: 'closeAll' }
  | {
      type: 'setActiveChat';
      payload: { id: string | null; type: 'private' | 'space' | null; name?: string | null };
    };

export const useSideBarReducer = () => {
  const sidebarReducer = (state: any, action: SideBarAction) => {
    switch (action.type) {
      case 'closeAll':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          showLeaveSpc: false,
          showPermissions: false,
          hideAll: true,
        };
      case 'showCreateSpace':
        return {
          ...state,
          showCreateSpace: !state.showCreateSpace,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
        };
      case 'showCreateBlog':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: !state.showCreateBlog,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
        };
      case 'showAddMember':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: !state.showAddMember,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
        };
      case 'showMembers':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: !state.showMembers,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
        };
      case 'showEditSpace':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: !state.showEditSpace,
          showChat: false,
          hideAll: false,
        };
      case 'showChat':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: !state.showChat,
          hideAll: !state.hideAll,
        };
      case 'showLeaveSpc':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
          showLeaveSpc: !state.showLeaveSpc,
          showPermissions: false,
        };
      case 'showPermissions':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
          showLeaveSpc: false,
          showPermissions: !state.showPermissions,
        };
      case 'setActiveChat':
        return {
          ...state,
          activeChatId: action.payload.id,
          activeChatType: action.payload.type,
          activeChatName: action.payload.name,
          showChat: !!action.payload.id,
        };
      default:
        return state;
    }
  };

  const [state, dispatch]: [State, Dispatch<SideBarAction>] = useReducer(sidebarReducer, {
    showCreateSpace: false,
    showCreateBlog: false,
    showAddMember: false,
    showMembers: false,
    showEditSpace: false,
    showChat: false,
    hideAll: false,
    showLeaveSpc: false,
    showPermissions: false,
    activeChatId: null,
    activeChatType: null,
    activeChatName: null,
  } as never);

  return { state, dispatch };
};
