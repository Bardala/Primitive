import { deleteFn, getFn, patchFn, postFn, putFn } from '@/core/services';

import {
  AddBlogToSeriesReq,
  CreateSeriesReq,
  ENDPOINT,
  GetSeriesRes,
  ListSeriesRes,
  UpdateSeriesReq,
} from '@nest/shared';

export const SeriesApi = {
  createSeries: (data: CreateSeriesReq) =>
    postFn<CreateSeriesReq, GetSeriesRes>(ENDPOINT.CREATE_SERIES, data),

  updateSeries: (seriesId: string, data: UpdateSeriesReq) =>
    putFn<UpdateSeriesReq, GetSeriesRes>(ENDPOINT.UPDATE_SERIES, data, [seriesId]),

  getSeries: (seriesId: string) => getFn<GetSeriesRes>(ENDPOINT.GET_SERIES, [seriesId]),

  getUserSeries: () => getFn<ListSeriesRes>(ENDPOINT.GET_USER_SERIES),

  deleteSeries: (seriesId: string) => deleteFn<void>(ENDPOINT.DELETE_SERIES, [seriesId]),

  addBlogToSeries: (seriesId: string, data: AddBlogToSeriesReq) =>
    patchFn<AddBlogToSeriesReq, void>(ENDPOINT.ADD_BLOG_TO_SERIES, data, [seriesId]),

  removeBlogFromSeries: (seriesId: string, blogId: string) =>
    deleteFn<void>(ENDPOINT.REMOVE_BLOG_FROM_SERIES, [seriesId, blogId]),
};
