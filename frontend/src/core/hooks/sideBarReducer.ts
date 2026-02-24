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
  showCreateSeries: boolean;
  hideAll: boolean;
  activeChatId?: string | null;
  activeChatType?: 'private' | 'space' | null;
  activeChatName?: string | null;
  showMobileSidebar: boolean;
  showUserMenu: boolean;
}

export type SideBarAction =
  | { type: 'showCreateBlog' }
  | { type: 'showCreateSeries' }
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
    }
  | { type: 'toggleMobileSidebar' }
  | { type: 'closeMobileSidebar' }
  | { type: 'toggleUserMenu' }
  | { type: 'closeUserMenu' };

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
          showCreateSeries: false,
          hideAll: true,
          showMobileSidebar: false,
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
          showCreateSeries: false,
          showAddMember: false,
          showMembers: false,
          showEditSpace: false,
          showChat: false,
          hideAll: false,
        };
      case 'showCreateSeries':
        return {
          ...state,
          showCreateSpace: false,
          showCreateBlog: false,
          showCreateSeries: !state.showCreateSeries,
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
      case 'toggleMobileSidebar':
        return {
          ...state,
          showMobileSidebar: !state.showMobileSidebar,
        };
      case 'closeMobileSidebar':
        if (!state.showMobileSidebar) return state;
        return {
          ...state,
          showMobileSidebar: false,
        };
      case 'toggleUserMenu':
        return {
          ...state,
          showUserMenu: !state.showUserMenu,
        };
      case 'closeUserMenu':
        return {
          ...state,
          showUserMenu: false,
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
    showCreateSeries: false,
    hideAll: false,
    showLeaveSpc: false,
    showPermissions: false,
    activeChatId: null,
    activeChatType: null,
    activeChatName: null,
    showMobileSidebar: false,
    showUserMenu: false,
  } as never);

  return { state, dispatch };
};
