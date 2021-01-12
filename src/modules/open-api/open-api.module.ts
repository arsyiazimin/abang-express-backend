import { Module } from '@nestjs/common';
import { OpenApiController } from './controller/open-api/open-api.controller';
import { OpenApiService } from './service/open-api/open-api.service';
import { BlogService } from '../../modules/blog/service/blog/blog.service';
import { BlogModule } from '../../modules/blog/blog.module';
import { AbangExpressModule } from '../../global/abang-express/abang-express.module';
import { PartnerModule } from '../../modules/partner/partner.module';
import { LayananModule } from '../../modules/layanan/layanan.module';
import { CompanyModule } from '../../modules/company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cs } from './entity/cs.entity';

@Module({
  controllers: [OpenApiController],
  providers: [OpenApiService],
  imports: [
    TypeOrmModule.forFeature([
      Cs
    ]),
    BlogModule, AbangExpressModule, PartnerModule, LayananModule, CompanyModule]
})
export class OpenApiModule { }
