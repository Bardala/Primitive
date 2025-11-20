import { GetUserCardRes, UserCard } from '@nest/shared';

export class GetUserCardDto implements GetUserCardRes {
  userCard: UserCard;
}
