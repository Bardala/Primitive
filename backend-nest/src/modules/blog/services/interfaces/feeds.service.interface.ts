import { FeedsResDto } from '../../dto';

export interface IFeedsService {
  getPersonalFeeds(memberId: string, page: number): Promise<FeedsResDto>;
  getPublicFeeds(page: number): Promise<FeedsResDto>;
  getSmartFeeds(memberId: string, page: number): Promise<FeedsResDto>;
  getSmartPublicFeeds(page: number): Promise<FeedsResDto>;
}
