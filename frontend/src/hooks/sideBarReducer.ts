import { Dispatch, useReducer } from 'react';

interface State {
  showCreateSpace: boolean;
  showCreateBlog: boolean;
  showAddMember: boolean;
  showMembers: boolean;
  showEditSpace: boolean;
  showChat: boolean;
  showLeaveSpc: boolean;
  hideAll: boolean;
}

export type SideBarAction =
  | { type: 'showCreateBlog' }
  | { type: 'showCreateSpace' }
  | { type: 'showAddMember' }
  | { type: 'showMembers' }
  | { type: 'showEditSpace' }
  | { type: 'showChat' }
  | { type: 'showLeaveSpc' };

export const useSideBarReducer = () => {
  const sidebarReducer = (state: any, action: SideBarAction) => {
    switch (action.type) {
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
  } as never);

  return { state, dispatch };
};
