import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { ShortController } from './controllers/short.controller';
import { ShortService } from './services/short.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Space])],
  controllers: [ShortController],
  providers: [ShortService],
  exports: [ShortService],
})
export class ShortModule {}
