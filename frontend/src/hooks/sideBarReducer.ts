import { Dispatch, useReducer } from 'react';

interface State {
  showCreateSpace: boolean;
  showCreateBlog: boolean;
  showAddMember: boolean;
  showMembers: boolean;
  showEditSpace: boolean;
  showChat: boolean;
  hideAll: boolean;
}

type Action =
  | { type: 'showCreateBlog' }
  | { type: 'showCreateSpace' }
  | { type: 'showAddMember' }
  | { type: 'showMembers' }
  | { type: 'showEditSpace' }
  | { type: 'showChat' };

export const useSideBarReducer = () => {
  const sidebarReducer = (state: any, action: Action) => {
    switch (action.type) {
      // for any case map through the other cases and set them to false and the current case to true
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
      default:
        return state;
    }
  };

  // state type

  const [state, dispatch]: [State, Dispatch<Action>] = useReducer(sidebarReducer, {
    showCreateSpace: false,
    showCreateBlog: false,
    showAddMember: false,
    showMembers: false,
    showEditSpace: false,
    showChat: false,
    hideAll: false,
  } as never);

  return { state, dispatch };
};
