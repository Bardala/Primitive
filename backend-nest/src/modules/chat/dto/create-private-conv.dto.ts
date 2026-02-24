import { CreatePrivateConvoReq as ICreatePrivateConvoReq } from '@nest/shared';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePrivateConvoReq implements ICreatePrivateConvoReq {
  @IsUUID()
  @IsNotEmpty()
  otherUserId!: string;
}
