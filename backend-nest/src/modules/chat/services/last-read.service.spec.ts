import { Test, TestingModule } from '@nestjs/testing';
import { LastReadService } from './last-read.service';

describe('LastReadService', () => {
  let service: LastReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastReadService],
    }).compile();

    service = module.get<LastReadService>(LastReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
