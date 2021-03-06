import { Module } from '@nestjs/common';
import { AbangExpressService } from './abang-express.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from './entity/agen.entity';
import { asal } from './entity/asal.entity';
import { priceList } from './entity/priceList.entity';
import { tujuan } from './entity/tujuan.entity';
import { kotaAgen } from './entity/kotaAgen.entity';
import { Transaksi } from './entity/transaksi.entity';
import { log } from './entity/log.entity';
import { outBound } from './entity/outbound.entity';
import { AbangExpressController } from './controller/abang-express.controller';
import { jenis } from './entity/jenis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      users,
      asal,
      priceList,
      tujuan,
      kotaAgen,
      Transaksi,
      log,
      outBound,
      jenis
    ])
  ],
  providers: [AbangExpressService],
  exports: [AbangExpressService],
  controllers: [AbangExpressController]
})
export class AbangExpressModule { }
