import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { SpacePermissionService } from '../services/space-permission.service';
import { UpdateSpacePermissionReq, GetSpacePermissionsRes } from '../dto/space-permissions.dto';

@ApiTags('Space Permissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('spaces')
export class SpacePermissionController {
  constructor(private permissionService: SpacePermissionService) {}

  @Get(':spaceId/permissions')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space permissions' })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved',
    type: GetSpacePermissionsRes,
  })
  async getPermissions(
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<GetSpacePermissionsRes> {
    return await this.permissionService.getPermissions(spaceId);
  }

  @Put(':spaceId/permissions')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update space permission' })
  @ApiResponse({ status: 200, description: 'Permission updated', type: GetSpacePermissionsRes })
  async updatePermission(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Body() req: UpdateSpacePermissionReq,
  ): Promise<GetSpacePermissionsRes> {
    return await this.permissionService.updatePermission(user.id, spaceId, req);
  }
}
