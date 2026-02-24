import { useAuthContext } from '@/core/context';
import { HOST, playNotificationSound, showSystemNotification, socket } from '@/core/utils';
import { PrivateChatApi } from '@/features/chat/api/private-chat.api';

import { ChatMessage, PrivateMessage, SOCKET_EVENT, Space } from '@nest/shared';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface ChatContextType {
  privateConversations: any[];
  spaces: (Space & { unreadCount: number; isMuted?: boolean })[];
  totalUnreadCount: number;
  isLoading: boolean;
  activeConversationId: string | null;
  activeConversationType: 'space' | 'private' | null;
  setActiveConversation: (id: string | null, type: 'space' | 'private' | null) => void;
  refreshConversations: () => Promise<void>;
  markPrivateAsRead: (conversationId: string) => Promise<void>;
  markSpaceAsRead: (spaceId: string) => Promise<void>;
  togglePrivateMute: (conversationId: string, isMuted?: boolean) => Promise<void>;
  toggleSpaceMute: (spaceId: string, isMuted?: boolean) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { currUser } = useAuthContext();
  const [privateConversations, setPrivateConversations] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<(Space & { unreadCount: number; isMuted?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversationType, setActiveConversationType] = useState<'space' | 'private' | null>(
    null
  );

  const setActiveConversation = useCallback(
    (id: string | null, type: 'space' | 'private' | null) => {
      setActiveConversationId(id);
      setActiveConversationType(type);
    },
    []
  );

  const fetchPrivateConversations = useCallback(async () => {
    if (!currUser) return;
    try {
      const data = await PrivateChatApi.getConversations();
      console.log('Fetched private chats:', data.conversations?.length);
      setPrivateConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch private conversations:', error);
    }
  }, [currUser]);

  // For spaces, we fetch joined spaces with unread counts.
  const fetchSpaces = useCallback(async () => {
    if (!currUser) return;
    try {
      const response = await fetch(`${HOST}/api/v0/conversations`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const res = await response.json();
      const spacesList = (res.data?.spaces || []) as (Space & { unreadCount: number })[];
      console.log('Fetched spaces:', spacesList.length);
      setSpaces(spacesList);
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  }, [currUser]);

  const refreshConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchPrivateConversations(), fetchSpaces()]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPrivateConversations, fetchSpaces]);

  useEffect(() => {
    if (currUser) {
      refreshConversations();
    }
  }, [currUser, refreshConversations]);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!currUser) return;

    const handlePrivateMsg = (message: PrivateMessage, playSound?: boolean) => {
      setPrivateConversations(prev => {
        const index = prev.findIndex(c => c.id === message.conversationId);
        const convo = index !== -1 ? prev[index] : null;

        // Check if user is currently viewing this conversation
        const isActiveConversation =
          activeConversationId === message.conversationId && activeConversationType === 'private';

        const isFromOthers = message.senderId !== currUser?.id;

        // If playSound is undefined, it means this came from 'PRIVATE_MSG' (in-room)
        // If playSound is boolean, it came from 'NOTIFICATION' (out-of-room)
        const isNotification = typeof playSound === 'boolean';

        // Play sound if:
        // 1. It's from others
        // 2. AND (If notification: backend said playSound, If in-room: it's not muted and not the active chat)
        const shouldPlay = isFromOthers && (
          isNotification ? playSound : (!convo?.isMuted && !isActiveConversation)
        );

        if (shouldPlay) {
          playNotificationSound();
        }

        if (isFromOthers && isNotification) {
          const senderName = (message as any).senderName || 'someone';
          const title = `New private message from ${senderName}`;
          showSystemNotification(title, {
            body: message.content,
          });
        }

        if (index === -1) {
          fetchPrivateConversations(); // New conversation started
          return prev;
        }

        const newConversations = [...prev];
        newConversations[index] = {
          ...convo,
          lastMessage: message,
          // Only increment unread if not currently viewing this conversation
          unreadCount: isActiveConversation ? 0 : convo.unreadCount + 1,
        };
        // Move to top
        const item = newConversations.splice(index, 1)[0];
        return [item, ...newConversations];
      });
    };

    const handleSpaceMsg = (message: ChatMessage, playSound?: boolean) => {
      setSpaces(prev => {
        const index = prev.findIndex(s => s.id === message.spaceId);
        const space = index !== -1 ? prev[index] : null;

        // Check if user is currently viewing this space
        const isActiveSpace =
          activeConversationId === message.spaceId && activeConversationType === 'space';

        const isFromOthers = message.userId !== currUser?.id;
        const isNotification = typeof playSound === 'boolean';

        // Play sound if:
        // 1. It's from others
        // 2. AND (If notification: backend said playSound, If in-room: it's not muted and not the active space)
        const shouldPlay = isFromOthers && (
          isNotification ? playSound : (!space?.isMuted && !isActiveSpace)
        );

        if (shouldPlay) {
          playNotificationSound();
        }

        if (isFromOthers && isNotification) {
          const sender = space?.name || 'a space';
          const title = `New message in ${sender}`;
          showSystemNotification(title, {
            body: `${message.username}: ${message.content}`,
          });
        }

        if (index === -1 || !space) return prev;

        const newSpaces = [...prev];
        newSpaces[index] = {
          ...space,
          // Only increment unread if not currently viewing this space
          unreadCount: isActiveSpace ? 0 : space.unreadCount + 1,
        };
        return newSpaces;
      });
    };

    const handleNotification = (data: any) => {
      if (data.type === 'PRIVATE_MESSAGE_NEW') {
        handlePrivateMsg(data.message, data.playSound);
      } else if (data.type === 'MESSAGE_NEW') {
        handleSpaceMsg(data.message, data.playSound);
      }
    };

    const handleReadConfirmed = (data: {
      spaceId?: string;
      conversationId?: string;
      conversationType: 'space' | 'private';
    }) => {
      if (data.conversationType === 'space' && data.spaceId) {
        setSpaces(prev => prev.map(s => (s.id === data.spaceId ? { ...s, unreadCount: 0 } : s)));
      } else if (data.conversationType === 'private' && data.conversationId) {
        setPrivateConversations(prev =>
          prev.map(c => (c.id === data.conversationId ? { ...c, unreadCount: 0 } : c))
        );
      }
    };

    socket.on(SOCKET_EVENT.NOTIFICATION, handleNotification);
    socket.on('PRIVATE_MSG', handlePrivateMsg);
    socket.on(SOCKET_EVENT.FROM_SERVER, handleSpaceMsg);
    socket.on('READ_CONFIRMED', handleReadConfirmed);

    return () => {
      socket.off(SOCKET_EVENT.NOTIFICATION, handleNotification);
      socket.off('PRIVATE_MSG', handlePrivateMsg);
      socket.off(SOCKET_EVENT.FROM_SERVER, handleSpaceMsg);
      socket.off('READ_CONFIRMED', handleReadConfirmed);
    };
  }, [currUser, fetchPrivateConversations, activeConversationId, activeConversationType]);

  const totalUnreadCount = useMemo(() => {
    // Only count unread messages from non-muted conversations for navbar notification
    const pcUnread = privateConversations
      .filter(c => !c.isMuted)
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    const sUnread = spaces
      .filter(s => !s.isMuted)
      .reduce((sum, s) => sum + (s.unreadCount || 0), 0);
    return pcUnread + sUnread;
  }, [privateConversations, spaces]);

  const markPrivateAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await PrivateChatApi.markAsRead(conversationId);
        setPrivateConversations(prev =>
          prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
        );
      } catch (error) {
        console.error('Failed to mark private chat as read', error);
      }
    },
    [setPrivateConversations]
  );

  const markSpaceAsRead = useCallback(
    async (spaceId: string) => {
      try {
        await fetch(`${HOST}/api/v0/spaces/${spaceId}/messages/read`, {
          method: 'POST',
          credentials: 'include',
        });
        setSpaces(prev => prev.map(s => (s.id === spaceId ? { ...s, unreadCount: 0 } : s)));
      } catch (error) {
        console.error('Failed to mark space chat as read', error);
      }
    },
    [setSpaces]
  );

  const togglePrivateMute = useCallback(
    async (conversationId: string, isMuted?: boolean) => {
      try {
        await fetch(`${HOST}/api/v0/chats/private/${conversationId}/mute`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isMuted }),
        });
        setPrivateConversations(prev =>
          prev.map(c => (c.id === conversationId ? { ...c, isMuted: isMuted ?? !c.isMuted } : c))
        );
      } catch (error) {
        console.error('Failed to toggle private mute', error);
      }
    },
    [setPrivateConversations]
  );

  const toggleSpaceMute = useCallback(
    async (spaceId: string, isMuted?: boolean) => {
      try {
        await fetch(`${HOST}/api/v0/spaces/${spaceId}/mute`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isMuted }),
        });
        setSpaces(prev =>
          prev.map(s => (s.id === spaceId ? { ...s, isMuted: isMuted ?? !s.isMuted } : s))
        );
      } catch (error) {
        console.error('Failed to toggle space mute', error);
      }
    },
    [currUser?.jwt, setSpaces]
  );

  return (
    <ChatContext.Provider
      value={{
        privateConversations,
        spaces,
        totalUnreadCount,
        isLoading,
        activeConversationId,
        activeConversationType,
        setActiveConversation,
        refreshConversations,
        markPrivateAsRead,
        markSpaceAsRead,
        togglePrivateMute,
        toggleSpaceMute,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
