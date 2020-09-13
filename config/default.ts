export default {
  // HOST: 'https://localhost', // dev
  HOST: 'http://127.0.0.1/', // prod
  PORT: '3200', // dev
  SECRET: 'asdasf;qqwrlmsdfmafk;rqwelqkrjlsdffsdfdsjhfksrweriuosfpyuirewbfmsdfbmsdfiwher;dsf;rerkhjgkertkr',
  API_KEY: '569ae74a-6f04-4a63-af52-bfcb0898d600',
  JWT_EXPIRED: 604800,
  DAILY_EXPIRED: 86400,
  SERVER_LINK: '',
  email: {
    USE_EMAIL_TESTER: 'yes', //dev
    EMAIL_TO_TESTER: 'arsyiazimin@gmail.com'
  },
  // prod
  db1: {
    NAME: 'default',
    DB_TYPE: 'mariadb',
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER_NAME: 'abaj2285_AX',
    DB_PASSWORD: 'setiawan007',
    DB_NAME: 'abaj2285_admin',
    DB_SYNCHRONIZE: false,
    DB_LOGGING: true
  },
  db2: {
    NAME: 'abaj2285_ax',
    DB_TYPE: 'mariadb',
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER_NAME: 'abaj2285_AX',
    DB_PASSWORD: 'setiawan007',
    DB_NAME: 'abaj2285_AX',
    DB_SYNCHRONIZE: false,
    DB_LOGGING: true
  },
  //dev
  // db1: {
  //   NAME: 'default',
  //   DB_TYPE: 'mysql',
  //   DB_HOST: 'localhost',
  //   DB_PORT: 3306,
  //   DB_USER_NAME: 'root',
  //   DB_PASSWORD: '',
  //   DB_NAME: 'db_ae',
  //   DB_SYNCHRONIZE: false,
  //   DB_LOGGING: true
  // },
  // db2: {
  //   NAME: 'abaj2285_ax',
  //   DB_TYPE: 'mysql',
  //   DB_HOST: 'localhost',
  //   DB_PORT: 3306,
  //   DB_USER_NAME: 'root',
  //   DB_PASSWORD: '',
  //   DB_NAME: 'abaj2285_ax',
  //   DB_SYNCHRONIZE: false,
  //   DB_LOGGING: true
  // },
  microservices: {
    TYPE: 'redis',
    HOST: '192.168.56.101',
    PORT: 6379,
    DURATION: 60000
  }
};
