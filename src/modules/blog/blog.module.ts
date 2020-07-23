import { Module } from '@nestjs/common';
import { BlogController } from './controller/blog/blog.controller';
import { BlogService } from './service/blog/blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entity/content.entity';
import { File } from './entity/file.entity';
import { cateCont } from './entity/categoryContent.entity';
import { TypeCont } from './entity/typeContent.entity';
import { cateRel } from './entity/cateRel.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Content,
      File,
      cateCont,
      TypeCont,
      cateRel
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
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule { }
