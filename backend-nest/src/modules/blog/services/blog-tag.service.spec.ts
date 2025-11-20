import { Test, TestingModule } from '@nestjs/testing';
import { BlogTagService } from './blog-tag.service';

describe('BlogTagService', () => {
  let service: BlogTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogTagService],
    }).compile();

    service = module.get<BlogTagService>(BlogTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
