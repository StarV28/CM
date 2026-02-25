import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import getPool from "../../../db/connect_MySQL.js";

// Интерфейс для произвольных данных (например, для create и update)
interface Record {
  [key: string]: unknown;
}

// Интерфейс для результата создания записи
interface CreateResult extends Record {
  id: number;
}

// Интерфейс для результата удаления
interface DeleteResult {
  id: string | number;
}

class ItemDBService {
  // Получение всех записей из таблицы
  static async getList(db: string): Promise<RowDataPacket[]> {
    try {
      const pool = await getPool();
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM \`${db}\``
      );
      return rows;
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  // Создание новой записи
  static async create(db: string, data: Record): Promise<CreateResult | null> {
    try {
      const pool = await getPool();
      const sql = `INSERT INTO \`${db}\` SET ?`;
      const [result] = await pool.query<ResultSetHeader>(sql, data);
      return { id: result.insertId, ...data };
    } catch (error: unknown) {
      console.error("Error saving data:", error);
      return null;
    }
  }

  // Поиск записи по ID
  static async getByID(
    db: string,
    nameID: string,
    id: string | number
  ): Promise<RowDataPacket | null> {
    try {
      const pool = await getPool();
      const sql = `SELECT * FROM \`${db}\` WHERE \`${nameID}\` = ?`;
      const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
      return rows[0] || null;
    } catch (error: unknown) {
      console.error("Error fetching data by ID:", error);
      return null;
    }
  }

  // Обновление записи по ID
  static async update(
    db: string,
    nameID: string,
    id: string | number,
    data: Record
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
    id: string | number
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
