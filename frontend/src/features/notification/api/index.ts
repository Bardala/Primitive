import { getFn, patchFn } from '@/core/services';

import { ENDPOINT, Notification } from '@nest/shared';

export const getNotifications = async (): Promise<Notification[]> => {
  const data = await getFn<{ notifications: Notification[] }>(ENDPOINT.GET_NOTIFICATIONS);
  return data?.notifications || [];
};

export const markAsRead = async (id: string): Promise<void> => {
  await patchFn(ENDPOINT.MARK_AS_READ, undefined, [id]);
};

export const markAllAsRead = async (): Promise<void> => {
  await patchFn(ENDPOINT.MARK_ALL_AS_READ);
};
