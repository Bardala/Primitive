import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { FeedsReq } from '@nest/shared';

export class FeedQueryReqDto implements FeedsReq {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  page: number = 1;
}
