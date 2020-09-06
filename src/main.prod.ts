import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { MyLoggerService } from './logger/my-logger/my-logger.service';
import * as fs from 'fs';
import * as https from 'https';
import * as express from 'express';
import { ExpressAdapter } from "@nestjs/platform-express";

declare const module: any;

async function bootstrap() {
  //if use https
  const httpsOptions = {
    key: fs.readFileSync('prod.key', 'utf8'),
    cert: fs.readFileSync('prod.cert', 'utf8')
  };

  // const expressApp = express();

  // const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const app = await NestFactory.create(AppModule);
  //if use logger
  app.useLogger(app.get(MyLoggerService));
  app.use(helmet());
  app.enableCors();

  // if use microservies
  // app.connectMicroservice({
  //   transport: Transport.REDIS,
  //   options: {
  //     url: 'redis://192.168.56.101:6379',
  //   },
  // });

  const hostDomain = AppModule.isDev
    ? `${AppModule.host}`
    : `${AppModule.host}`;
  console.log(hostDomain);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .setHost(hostDomain.split('//')[1])
    .setSchemes('http')
    .setBasePath('/api')
    .addBearerAuth('Authorization', 'header')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  app.use('/api/docs/swagger.json', (req, res) => {
    res.send(swaggerDoc);
  });

  SwaggerModule.setup('/api/docs', app, null, {
    swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.setGlobalPrefix('api');
  await app.listen(AppModule.port);
  // app.init();
  // await https.createServer(expressApp).listen(AppModule.port);
}
bootstrap();
