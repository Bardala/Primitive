import { Test, TestingModule } from '@nestjs/testing';
import { BlogSeriesService } from './blog-series.service';

describe('BlogSeriesService', () => {
  let service: BlogSeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogSeriesService],
    }).compile();

    service = module.get<BlogSeriesService>(BlogSeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
