/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConversationStateService } from './user-conversation-state.service';
import {
  UserConversationState,
  ConversationType,
} from '../entities/user-conversation-state.entity';
import { PrivateMessage } from '../entities/private-message.entity';
import { ChatMessage } from '../entities/chat-message.entity';

describe('UserConversationStateService', () => {
  let service: UserConversationStateService;
  let stateRepository: jest.Mocked<Repository<UserConversationState>>;
  let privateMessageRepository: jest.Mocked<Repository<PrivateMessage>>;
  let chatMessageRepository: jest.Mocked<Repository<ChatMessage>>;

  const mockStateRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockPrivateMessageRepository = {
    count: jest.fn(),
  };

  const mockChatMessageRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserConversationStateService,
        {
          provide: getRepositoryToken(UserConversationState),
          useValue: mockStateRepository,
        },
        {
          provide: getRepositoryToken(PrivateMessage),
          useValue: mockPrivateMessageRepository,
        },
        {
          provide: getRepositoryToken(ChatMessage),
          useValue: mockChatMessageRepository,
        },
      ],
    }).compile();

    service = module.get<UserConversationStateService>(UserConversationStateService);
    stateRepository = module.get(getRepositoryToken(UserConversationState));
    privateMessageRepository = module.get(getRepositoryToken(PrivateMessage));
    chatMessageRepository = module.get(getRepositoryToken(ChatMessage));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreate', () => {
    it('should return existing state if found', async () => {
      const existingState = {
        id: 'state-1',
        userId: 'user-1',
        conversationId: 'conv-1',
        conversationType: ConversationType.PRIVATE,
        lastReadAt: new Date(),
      };
      mockStateRepository.findOne.mockResolvedValue(existingState);

      const result = await service.getOrCreate('user-1', 'conv-1', ConversationType.PRIVATE);

      expect(result).toEqual(existingState);
      expect(mockStateRepository.save).not.toHaveBeenCalled();
    });

    it('should create new state if not found', async () => {
      mockStateRepository.findOne.mockResolvedValue(null);
      mockStateRepository.save.mockImplementation((state) => Promise.resolve(state));

      const result = await service.getOrCreate('user-1', 'conv-1', ConversationType.PRIVATE);

      expect(result.userId).toBe('user-1');
      expect(result.conversationId).toBe('conv-1');
      expect(result.conversationType).toBe(ConversationType.PRIVATE);
      expect(mockStateRepository.save).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should update lastReadAt to current time', async () => {
      const existingState = {
        id: 'state-1',
        userId: 'user-1',
        conversationId: 'conv-1',
        conversationType: ConversationType.PRIVATE,
        lastReadAt: new Date(0),
      };
      mockStateRepository.findOne.mockResolvedValue(existingState);
      mockStateRepository.save.mockImplementation((state) => Promise.resolve(state));

      const beforeMark = Date.now();
      const result = await service.markAsRead('user-1', 'conv-1', ConversationType.PRIVATE);
      const afterMark = Date.now();

      expect(result.lastReadAt.getTime()).toBeGreaterThanOrEqual(beforeMark);
      expect(result.lastReadAt.getTime()).toBeLessThanOrEqual(afterMark);
    });
  });

  describe('getPrivateUnreadCount', () => {
    it('should count messages after lastReadAt not sent by user', async () => {
      const lastReadAt = new Date('2023-01-01');
      mockStateRepository.findOne.mockResolvedValue({ lastReadAt });
      mockPrivateMessageRepository.count.mockResolvedValue(5);

      const result = await service.getPrivateUnreadCount('user-1', 'conv-1');

      expect(result).toBe(5);
      expect(mockPrivateMessageRepository.count).toHaveBeenCalled();
    });

    it('should count from epoch if no state exists', async () => {
      mockStateRepository.findOne.mockResolvedValue(null);
      mockPrivateMessageRepository.count.mockResolvedValue(10);

      const result = await service.getPrivateUnreadCount('user-1', 'conv-1');

      expect(result).toBe(10);
    });
  });

  describe('getSpaceUnreadCount', () => {
    it('should count space messages after lastReadAt not sent by user', async () => {
      const lastReadAt = new Date('2023-01-01');
      mockStateRepository.findOne.mockResolvedValue({ lastReadAt });
      mockChatMessageRepository.count.mockResolvedValue(3);

      const result = await service.getSpaceUnreadCount('user-1', 'space-1');

      expect(result).toBe(3);
      expect(mockChatMessageRepository.count).toHaveBeenCalled();
    });
  });
});
