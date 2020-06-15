import { Module } from '@nestjs/common';
import { UserLoginController } from './controllers/user-login.controller';
import { UserLoginService } from './services/user-login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogin } from './entity/userLogin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin])
  ],
  controllers: [UserLoginController],
  providers: [UserLoginService]
})
export class UserLoginModule { }
