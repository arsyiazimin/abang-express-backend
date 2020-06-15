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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLogin])
  ],
  providers: [UserService, PasswordHasherService],
  exports: [UserService, PasswordHasherService]
})
export class UserModule { }
