import { Module, NestModule, MiddlewareConsumer, RequestMethod, Inject } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from 'shared/configuration/configuration.service';
import { Configuration } from 'shared/configuration/configuratio.enum';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { MailerModule } from '@nest-modules/mailer';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
// import { UserModule } from './global/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EverytingSubscriber } from 'common/subscriber/EverythingSubscriber';
import { GlobalModule } from './global/global.module';
import { typeOrmDb1Config } from "./config/typeormDb1.config";
import { typeOrmDb2Config } from "./config/typeormDb2.config";
import { mailerConfig } from "./config/mailer.config";
import { AuthService } from 'auth/auth.service';
import { BlogModule } from './modules/blog/blog.module';
import { OpenApiModule } from './modules/open-api/open-api.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmDb1Config),
    TypeOrmModule.forRoot(typeOrmDb2Config),
    // MulterModule.register({
    //   storage: diskStorage({
    //     filename: (req, file, cb) => {
    //       let name = file.originalname.split('.').slice(0, -1)
    //       const randomName = `${name}`
    //       return cb(null, `${randomName}${extname(file.originalname)}`)
    //     }
    //   })
    // }),
    SharedModule,
    LoggerModule,
    AuthModule,
    GlobalModule,
    MailerModule.forRoot(mailerConfig),
    BlogModule,
    OpenApiModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }

  static host: string;
  static port: number | string;
  static isDev: boolean;
  static mailer: any;


  constructor(
    // @Inject('MailerProvider') private readonly mailerProvider,
    private readonly _configurationService: ConfigurationService) {

    // constructor(private readonly _configurationService: ConfigurationService) {

    AppModule.port = AppModule.normalizePort(
      _configurationService.get(Configuration.PORT),
    );
    AppModule.host = _configurationService.get(Configuration.HOST);
    AppModule.isDev = _configurationService.isDevelopment;
    // AppModule.mailer = mailerProvider;
    console.log(process.env.SMTP_USERNAME)
    console.log(process.env.SMTP_PASSWORD)
    console.log(process.env.SMTP_HOST)
    console.log(process.env.SMTP_PORT)
  }

  private static normalizePort(param: number | string): number | string {
    const portNumber: number =
      typeof param === 'string' ? parseInt(param, 10) : param;
    if (isNaN(portNumber)) return param;
    else if (portNumber >= 0) return portNumber;
  }
}
