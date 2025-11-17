export const LOCALS = {
  CURR_USER: 'currUser',
  FEED_PREFERENCES: 'blog-feed-preferences',
} as const;

export type LocalStorageKey = keyof typeof LOCALS;
