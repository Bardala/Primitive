import { getFn } from "@/core/services";
import { FeedsRes, ENDPOINT } from "@nest/shared";

export const TagApi = {
  tagBlogsApi: (tagId: string, pageParam: number = 1) =>
    getFn<FeedsRes>(ENDPOINT.GET_TAG_BLOGS, [tagId], undefined, { page: pageParam.toString() }),

  tagBlogsByNameApi: (tagName: string, pageParam: number = 1) =>
    getFn<FeedsRes>(ENDPOINT.GET_TAG_BLOGS_BY_NAME, [tagName], undefined, { page: pageParam.toString() }),
}