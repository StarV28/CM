import dotenv from "dotenv";
dotenv.config();

export interface Config {
  db: {
    mysql: {
      host?: string;
      user?: string;
      password?: string;
      database?: string;
      port: number;
    };
  };
  email: {
    user?: string;
    password?: string;
  };
  url: {
    redis_url?: string;
  };
  port?: string;
  secretKey?: string;
  jwtSecret?: string;
  apiKeyCmc?: string;
}

const config: Config = {
  db: {
    mysql: {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
      port: Number(process.env.SQL_PORT) || 3306,
    },
  },
  email: {
    user: process.env.MAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  url: {
    redis_url: process.env.REDIS_URL,
  },
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
  apiKeyCmc: process.env.API_CMC_KEY,
};

export default Object.freeze(config);
