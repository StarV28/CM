import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import getPool from "../../../db/connect_MySQL.js";
import { User } from "../modules/types/user.js";

// Интерфейс для произвольных данных (например, для create и update)
// interface Record {
//   [key: string]: unknown;
// }

// Интерфейс для результата создания записи
interface CreateResult {
  id: number;
}

// Интерфейс для результата удаления
interface DeleteResult {
  id: string | number;
}

type SqlValue = string | number | boolean | Date | null | Buffer;

//-------------------------------------------------------------------------------------//

class ItemDBService {
  // Получение всех записей из таблицы
  static async getList<T = RowDataPacket>(db: string): Promise<T[]> {
    try {
      const pool = await getPool();
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM \`${db}\``,
      );
      return rows as T[];
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  // Создание новой записи
  static async create<T extends Record<string, SqlValue>>(
    db: string,
    data: T,
  ): Promise<ResultSetHeader | null> {
    try {
      const pool = await getPool();
      const sql = `INSERT INTO \`${db}\` SET ?`;
      const [result] = await pool.query<ResultSetHeader>(sql, data);
      return result;
    } catch (error: unknown) {
      console.error("Error saving data:", error);
      return null;
    }
  }

  // Поиск записи по ID
  static async getByID<T = RowDataPacket>(
    db: string,
    nameID: string,
    id: string | number,
  ): Promise<T | null> {
    try {
      const pool = await getPool();
      const sql = `SELECT * FROM \`${db}\` WHERE \`${nameID}\` = ?`;
      const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
      return rows[0] ? (rows[0] as T) : null;
    } catch (error: unknown) {
      console.error("Error fetching data by ID:", error);
      return null;
    }
  }

  // Поиск по email
  static async findOne<T = User>(db: string, email: string): Promise<T | null> {
    try {
      const pool = await getPool();
      const sql = `SELECT * FROM ${db} WHERE email = ? LIMIT 1`;
      const [rows] = await pool.query<RowDataPacket[]>(sql, [email]);

      if (rows.length === 0) return null;

      return rows[0] as T;
    } catch (error: unknown) {
      console.error("Error find bi email", error);
      return null;
    }
  }

  // Обновление записи по ID
  static async update<T extends object>(
    db: string,
    nameID: string,
    id: string | number,
    data: T,
  ): Promise<CreateResult | null> {
    try {
      const pool = await getPool();
      const sql = `UPDATE \`${db}\` SET ? WHERE \`${nameID}\` = ?`;
      const [result] = await pool.query<ResultSetHeader>(sql, [data, id]);

      if (result.affectedRows === 0) {
        return null;
      }

      return { id: Number(id), ...data };
    } catch (error: unknown) {
      console.error("Error updating data:", error);
      return null;
    }
  }

  // Удаление записи по ID
  static async deleteById(
    db: string,
    idName: string,
    id: string | number,
  ): Promise<DeleteResult | null> {
    try {
      const pool = await getPool();
      const sql = `DELETE FROM \`${db}\` WHERE \`${idName}\` = ?`;
      const [result] = await pool.query<ResultSetHeader>(sql, [id]);
      if (result.affectedRows === 0) {
        return null;
      }
      return { id };
    } catch (error: unknown) {
      console.error("Error deleting data:", error);
      return null;
    }
  }
}

export default ItemDBService;
