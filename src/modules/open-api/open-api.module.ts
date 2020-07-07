import { Module } from '@nestjs/common';
import { OpenApiController } from './controller/open-api/open-api.controller';
import { OpenApiService } from './service/open-api/open-api.service';

@Module({
  controllers: [OpenApiController],
  providers: [OpenApiService]
})
export class OpenApiModule {}
