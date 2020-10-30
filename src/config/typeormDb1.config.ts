import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EverytingSubscriber } from '../common/subscriber/EverythingSubscriber';
import * as config from 'config';

const dbConfig = config.get('db1')
const microservicesConfig = config.get('microservices')

export const typeOrmDb1Config: TypeOrmModuleOptions = {
    name: dbConfig['NAME'],
    type: dbConfig['DB_TYPE'],
    host: dbConfig['DB_HOST'],
    port: dbConfig['DB_PORT'],
    username: dbConfig['DB_USER_NAME'],
    password: dbConfig['DB_PASSWORD'],
    database: dbConfig['DB_NAME'],
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: dbConfig['DB_SYNCHRONIZE'],
    subscribers: [EverytingSubscriber],
    logging: true,
    // cache: {
    //   type: microservicesConfig['TYPE'],
    //   options: {
    //     host: microservicesConfig['HOST'], //production
    //     port: microservicesConfig['PORT'],
    //   },
    //   duration: microservicesConfig['DURATION'],
    // },
}