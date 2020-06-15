import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SharedModule } from 'shared/shared.module';
import { MenuModule } from './menu/menu.module';
import { UserLoginModule } from './user-login/user-login.module';

@Module({
  imports: [UserModule, MenuModule, UserLoginModule],
  exports: [UserModule, MenuModule, UserLoginModule]
})
export class GlobalModule { }
