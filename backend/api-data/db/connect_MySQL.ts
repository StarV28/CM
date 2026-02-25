import { createPool, Pool } from "mysql2/promise";
import config from "../config/index.js";

interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

const mysqlConfig: MySQLConfig = {
  // В docker обязательно mysql, НЕ localhost
  host: config.db.mysql.host || "mysql",
  user: config.db.mysql.user || "root",
  password: config.db.mysql.password || "",
  database: config.db.mysql.database || "mydb",
  port: config.db.mysql.port || 3306,
};

let pool: Pool | null = null;

async function createPoolWithRetry(): Promise<Pool> {
  const maxRetries = 10;

  for (let i = 1; i <= maxRetries; i++) {
    try {
      const newPool = createPool({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // ВАЖНО — реально проверяем соединение
      const conn = await newPool.getConnection();
      conn.release();

      console.log("✅ Successful connection to the MySQL");
      return newPool;
    } catch (err) {
      console.log(
        `❌ MySQL not ready (attempt ${i}/${maxRetries}), ${(err as Error).message}`,
      );
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  throw new Error("Cannot connect to MySQL after retries");
}

export default async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = await createPoolWithRetry();
  }
  return pool;
}
