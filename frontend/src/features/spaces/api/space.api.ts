import { deleteFn, getFn, postFn, putFn } from '@/core/services';

import {
  AddMemberReq,
  AddMemberRes,
  CreateSpaceReq,
  CreateSpaceRes,
  ENDPOINT,
  JoinSpaceReq,
  JoinSpaceRes,
  LeaveSpaceRes,
  MembersRes,
  SpaceBlogsRes,
  SpaceRes,
  UpdateSpaceReq,
  UpdateSpaceRes,
} from '@nest/shared';

export const SpaceApi = {
  getSpace: (spaceId: string) => getFn<SpaceRes>(ENDPOINT.GET_SPACE, [spaceId]),

  getDefaultSpace: () => getFn<SpaceRes>(ENDPOINT.GET_DEFAULT_SPACE),

  getSpaceBlogs: (spaceId: string, page: number = 1) =>
    getFn<SpaceBlogsRes>(ENDPOINT.GET_SPACE_BLOGS, [spaceId, page.toString()]),

  getSpaceMembers: (spaceId: string) => getFn<MembersRes>(ENDPOINT.GET_SPACE_MEMBERS, [spaceId]),

  joinSpace: (spaceId: string) =>
    postFn<JoinSpaceReq, JoinSpaceRes>(ENDPOINT.JOIN_SPACE, undefined, [spaceId]),

  leaveSpace: (spaceId: string) => deleteFn<LeaveSpaceRes>(ENDPOINT.LEAVE_SPACE, [spaceId]),

  addMember: (spaceId: string, member: string, isAdmin: boolean = false) =>
    postFn<AddMemberReq, AddMemberRes>(ENDPOINT.ADD_MEMBER, { member, isAdmin }, [spaceId]),

  createSpace: (input: CreateSpaceReq) =>
    postFn<CreateSpaceReq, CreateSpaceRes>(ENDPOINT.CREATE_SPACE, input),

  updateSpace: (spaceId: string, input: UpdateSpaceReq) =>
    putFn<UpdateSpaceReq, UpdateSpaceRes>(ENDPOINT.UPDATE_SPACE, input, [spaceId]),
};
