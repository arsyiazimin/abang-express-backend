import { Module } from '@nestjs/common';
import { CompanyController } from './controller/company.controller';
import { CompanyService } from './service/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company
    ]),
    MulterModule.register({
      storage: diskStorage({
        filename: (req, file, cb) => {
          let name = file.originalname.split('.').slice(0, -1)
          const randomName = `${name}`
          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
      })
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompanyModule { }
