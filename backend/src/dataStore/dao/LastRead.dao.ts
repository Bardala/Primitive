import { LastReadMsg } from '@nest/shared';

export interface LastReadDao {
  updateLastRead(lastRead: LastReadMsg): Promise<void>;
  getLastRead(userId: string, spaceId: string): Promise<LastReadMsg | undefined>;
  deleteUserLastRead(userId: string): Promise<void>;
  deleteSpaceLastRead(spaceId: string): Promise<void>;
}
