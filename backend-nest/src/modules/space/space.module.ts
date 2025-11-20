import { Module } from '@nestjs/common';
import { SpaceController } from './controllers/space.controller';
import { SpaceService } from './services/space.service';
import { SpaceMemberService } from './services/space-member.service';
import { SpacePermissionService } from './services/space-permission.service';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, SpaceMemberService, SpacePermissionService],
})
export class SpaceModule {}
