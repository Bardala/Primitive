import type {
  DeleteBlogReq as IDeleteBlogReq,
  DeleteBlogRes as IDeleteBlogRes,
  StatusMessage,
} from '@nest/shared';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteBlogReq implements IDeleteBlogReq {}

export class DeleteBlogRes implements IDeleteBlogRes {
  @ApiProperty({
    example: 'Blog deleted successfully',
    description: 'Success message',
  })
  message!: StatusMessage;
}
