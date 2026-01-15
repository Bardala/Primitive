import { LastRead } from '../../entities';

export interface ILastRead {
  updateLastRead(lastRead: LastRead): Promise<void>;
  getLastRead(userId: string, spaceId: string): Promise<LastRead | null>;
  deleteUserLastRead(userId: string): Promise<void>;
  deleteSpaceLastRead(spaceId: string): Promise<void>;
}
