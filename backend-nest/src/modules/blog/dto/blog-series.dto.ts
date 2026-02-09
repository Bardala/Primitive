import { IsString, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateSeriesReq as ICreateSeriesReq,
  UpdateSeriesReq as IUpdateSeriesReq,
  AddBlogToSeriesReq as IAddBlogToSeriesReq,
  GetSeriesRes as IGetSeriesRes,
  ListSeriesRes as IListSeriesRes,
  Blog,
} from '@nest/shared';
import { BlogSeries } from '../entities';

export class CreateSeriesReq implements ICreateSeriesReq {
  @ApiProperty({ description: 'Name of the blog series' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description of the series', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSeriesReq implements IUpdateSeriesReq {
  @ApiProperty({ description: 'Name of the blog series', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the series', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AddBlogToSeriesReq implements IAddBlogToSeriesReq {
  @ApiProperty({ description: 'ID of the blog to add' })
  @IsUUID()
  blogId!: string;

  @ApiProperty({ description: 'Position in the series' })
  @IsNumber()
  @Min(1)
  position!: number;
}

export class GetSeriesRes implements IGetSeriesRes {
  series!: BlogSeries;

  @ApiProperty({ type: [Object] })
  blogs!: (Pick<Blog, 'id' | 'title' | 'author'> & { position: number })[];
}

export class ListSeriesRes implements IListSeriesRes {
  @ApiProperty({ type: [GetSeriesRes] })
  series!: BlogSeries[];
}
