import { Test, TestingModule } from '@nestjs/testing';
import { SpacePermissionService } from './space-permission.service';

describe('SpacePermissionService', () => {
  let service: SpacePermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpacePermissionService],
    }).compile();

    service = module.get<SpacePermissionService>(SpacePermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
