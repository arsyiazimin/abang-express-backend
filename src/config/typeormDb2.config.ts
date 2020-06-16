import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EverytingSubscriber } from '../common/subscriber/EverythingSubscriber';
import * as config from 'config';

const dbConfig = config.get('db2')
const microservicesConfig = config.get('microservices')

export const typeOrmDb2Config: TypeOrmModuleOptions = {
    name: dbConfig['NAME'],
    type: dbConfig['DB_TYPE'],
    host: process.env.RDS_HOSTNAME || dbConfig['DB_HOST'],
    port: process.env.RDS_PORT || dbConfig['DB_PORT'],
    username: process.env.RDS_USERNAME || dbConfig['DB_USER_NAME'],
    password: process.env.RDS_PASSWORD || dbConfig['DB_PASSWORD'],
    database: process.env.RDS_DB_NAME || dbConfig['DB_NAME'],
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