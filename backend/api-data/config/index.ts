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
  port?: string;
  secretKey?: string;
  jwtSecret?: string;
  authGoogle?: {
    clientId?: string;
    clientSecret?: string;
  };
  url: {
    api_url?: string;
    frontend_url?: string;
    redis_url?: string;
  };
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
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
  jwtSecret: process.env.JWT_SECRET,
  authGoogle: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  url: {
    api_url: process.env.API_URL,
    frontend_url: process.env.FRONTEND_URL,
    redis_url: process.env.REDIS_URL,
  },
};

export default Object.freeze(config);
