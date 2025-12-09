import { Test, TestingModule } from '@nestjs/testing';

import { UserConversationStateService } from './user-conversation-state.service';

describe('UserConversationStateService', () => {
  let service: UserConversationStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConversationStateService],
    }).compile();

    service = module.get<UserConversationStateService>(UserConversationStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
