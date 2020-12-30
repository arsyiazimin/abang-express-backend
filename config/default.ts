export default {
  HOST: 'https://localhost', // dev
  PORT: '3200', // dev
  SECRET: 'asdasf;qqwrlmsdfmafk;rqwelqkrjlsdffsdfdsjhfksrweriuosfpyuirewbfmsdfbmsdfiwher;dsf;rerkhjgkertkr',
  JWT_EXPIRED: 604800,
  DAILY_EXPIRED: 86400,
  SERVER_LINK: '',
  email: {
    USE_EMAIL_TESTER: 'yes', //dev
    EMAIL_TO_TESTER: 'arsyiazimin@gmail.com'
  },
  db1: {
    NAME: 'default',
    DB_TYPE: 'mysql',
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER_NAME: 'root',
    DB_PASSWORD: '',
    DB_NAME: 'db_ae',
    DB_SYNCHRONIZE: false,
    DB_LOGGING: true
  },
  db2: {
    NAME: 'abaj2285_ax',
    DB_TYPE: 'mysql',
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER_NAME: 'root',
    DB_PASSWORD: '',
    DB_NAME: 'abaj2285_ax',
    DB_SYNCHRONIZE: false,
    DB_LOGGING: true
  },
  microservices: {
    TYPE: 'redis',
    HOST: '192.168.56.101',
    PORT: 6379,
    DURATION: 60000
  }
};
