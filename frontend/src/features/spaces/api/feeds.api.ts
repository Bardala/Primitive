import { getFn } from '@/core/services';

import { ENDPOINT, FeedsReq, FeedsRes } from '@nest/shared';

export const FeedsApi = {
  getFeeds: (page: number = 1) => getFn<FeedsRes>(ENDPOINT.GET_FEEDS_PAGE, [page.toString()]),

  getSmarterFeeds: (page: number = 1) =>
    getFn<FeedsRes>(ENDPOINT.Get_SMART_FEEDS, [page.toString()]),

  getPersonalFeeds: (query?: FeedsReq) => getFn<FeedsRes>(ENDPOINT.PERSONAL_FEEDS, [], null, query),

  getSmartFeeds: (query?: FeedsReq) => getFn<FeedsRes>(ENDPOINT.SMART_FEEDS, [], null, query),

  getMixedFeeds: (query?: FeedsReq) => getFn<FeedsRes>(ENDPOINT.MIXED_FEEDS, [], null, query),

  getPublicFeeds: (query?: FeedsReq) => getFn<FeedsRes>(ENDPOINT.PUBLIC_FEEDS, [], null, query),

  getSmartPublicFeeds: (query?: FeedsReq) =>
    getFn<FeedsRes>(ENDPOINT.SMART_PUBLIC_FEEDS, [], null, query),

  getUserFeeds: (userId: string, query?: FeedsReq) =>
    getFn<FeedsRes>(ENDPOINT.USER_FEEDS, [userId], null, query),
};
