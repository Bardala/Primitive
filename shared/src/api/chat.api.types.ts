import { ChatMessage } from '../types';

export interface CreateMsgReq {
  content: string;
}
export interface CreateSocketMsgReq {
  content: string;
  spaceId: string;
}
export interface CreateMsgRes {
  message: ChatMessage;
}

export interface DeleteMsgReq {}
export interface DeleteMsgRes {}
