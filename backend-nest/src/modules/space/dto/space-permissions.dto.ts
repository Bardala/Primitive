import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpacePermissionType, AllowedRole } from '@nest/shared';

export class UpdateSpacePermissionReq {
  @ApiProperty({ enum: SpacePermissionType })
  @IsEnum(SpacePermissionType)
  permission!: SpacePermissionType;

  @ApiProperty({ enum: AllowedRole })
  @IsEnum(AllowedRole)
  allowedRole!: AllowedRole;
}

export class GetSpacePermissionsRes {
  @ApiProperty({ type: [Object] })
  permissions!: {
    id: string;
    permission: SpacePermissionType;
    allowedRole: AllowedRole;
  }[];
}
