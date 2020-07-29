import { Module } from '@nestjs/common';
import { LayananController } from './controller/layanan.controller';
import { LayananService } from './service/layanan.service';
import { Layanan } from './entity/layanan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Layanan
    ])
  ],
  controllers: [LayananController],
  providers: [LayananService],
  exports: [LayananService]
})
export class LayananModule { }
