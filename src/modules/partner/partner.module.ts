import { Module } from '@nestjs/common';
import { PartnerController } from './controller/partner.controller';
import { PartnerService } from './service/partner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entity/partner.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Partner
        ])
    ],
    controllers: [PartnerController],
    providers: [PartnerService],
    exports: [PartnerService]
})
export class PartnerModule { }