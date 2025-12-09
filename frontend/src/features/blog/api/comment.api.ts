import { deleteFn, getFn, postFn, putFn } from '@/core/services';

import {
  BlogCommentsRes,
  CreateCommentReq,
  CreateCommentRes,
  DeleteCommentRes,
  ENDPOINT,
  NumOfCommentsRes,
  UpdateCommentReq,
  UpdateCommentRes,
} from '@nest/shared';

export const CommentApi = {
  getBlogComments: (blogId: string) => getFn<BlogCommentsRes>(ENDPOINT.GET_BLOG_COMMENTS, [blogId]),

  createComment: (blogId: string, content: string) =>
    postFn<CreateCommentReq, CreateCommentRes>(ENDPOINT.CREATE_COMMENT, { content }, [blogId]),

  updateComment: (commentId: string, data: UpdateCommentReq) =>
    putFn<UpdateCommentReq, UpdateCommentRes>(ENDPOINT.UPDATE_COMMENT, data, [commentId]),

  deleteComment: (commentId: string) =>
    deleteFn<DeleteCommentRes>(ENDPOINT.DELETE_COMMENT, [commentId]),

  getNumOfComments: (blogId: string) => getFn<NumOfCommentsRes>(ENDPOINT.NUM_OF_COMMENTS, [blogId]),
};
