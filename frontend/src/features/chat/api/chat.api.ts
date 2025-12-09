import { getFn, postFn } from '@/core/services';

import {
  AllUnReadMsgsRes,
  ChatRes,
  CreateMsgReq,
  CreateMsgRes,
  ENDPOINT,
  UnReadMsgsNumRes,
} from '@nest/shared';

export const ChatApi = {
  getSpaceChat: (spaceId: string) => getFn<ChatRes>(ENDPOINT.Get_SPACE_CHAT, [spaceId]),

  createMessage: (spaceId: string, content: string) =>
    postFn<CreateMsgReq, CreateMsgRes>(ENDPOINT.CREATE_MESSAGE, { content }, [spaceId]),

  getNumOfUnreadMessages: (spaceId: string) =>
    getFn<UnReadMsgsNumRes>(ENDPOINT.GET_UNREAD_MSGS_NUM, [spaceId]),

  getAllUnreadMessages: () => getFn<AllUnReadMsgsRes>(ENDPOINT.GET_ALL_UNREAD_MSGS),
};
