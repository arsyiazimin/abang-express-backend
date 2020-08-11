import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user/user.service';
import { PasswordHasherService } from './services/hasher/password-hasher/password-hasher.service';
import { SharedModule } from 'shared/shared.module';
import { EmailService } from 'shared/mailer/email-service/email-service.service';
import { User } from "./entity/user.entity";
import { UserLogin } from 'global/user-login/entity/userLogin.entity';
import { AuthService } from 'auth/auth.service';
import { AuthModule } from 'auth/auth.module';
import { UserController } from './controller/user/user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLogin]),
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
  providers: [UserService, PasswordHasherService],
  exports: [UserService, PasswordHasherService],
  controllers: [UserController]
})
export class UserModule { }
