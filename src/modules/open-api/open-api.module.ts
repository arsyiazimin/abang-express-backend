import { Module } from '@nestjs/common';
import { OpenApiController } from './controller/open-api/open-api.controller';
import { OpenApiService } from './service/open-api/open-api.service';
import { BlogService } from 'modules/blog/service/blog/blog.service';
import { BlogModule } from 'modules/blog/blog.module';

@Module({
  controllers: [OpenApiController],
  providers: [OpenApiService],
  imports: [BlogModule]
})
export class OpenApiModule {}
