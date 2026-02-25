import bcrypt from "bcrypt";
import getPool from "../../../../db/connect_MySQL.js";
import type { UserRequest, User } from "../../modules/types/user.js";
import ItemDBService from "../../modules/CRUD.js";
import { createUsersTable } from "../../tables/users.table.js";

//-------------------------------------------------------------------------------------//

export default class UsersModel {
  //-------------------------------------------------------------------------------------//

  static async userCreate(data: UserRequest): Promise<User> {
    try {
      const pool = await getPool();

      const [rows] = await pool.query(`SHOW TABLES LIKE 'users'`);

      if (Array.isArray(rows) && rows.length <= 0) {
        await createUsersTable();
      }

      const user = data.data;

      if (!user.password) throw new Error("Password is required");

      const hashPass = await bcrypt.hash(user.password, 10);
      user.password = hashPass;

      const existingUser = await ItemDBService.findOne<User>(
        "users",
        user.email,
      );
      if (existingUser) {
        const result: User & { success: boolean; message: string } = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name ?? null,
          password: existingUser.password,
          success: false,
          message: "This address is already taken",
        };
        return result;
      }

      const createdResult = await ItemDBService.create("users", user);
      if (!createdResult) throw new Error("User creation failed");

      const createdUser: User = {
        id: createdResult.insertId,
        email: user.email,
        name: user.name ?? null,
        password: hashPass,
      };

      return createdUser;
    } catch (err) {
      console.error("Error saved user in Model", (err as Error)?.message);
      throw err;
    }
  }
  //-------------------------------------------------------------------------------------//
  static async userCheckLogIn(
    userPass: string | undefined,
    dbPass: string | undefined,
  ) {
    try {
      if (!dbPass || !userPass) return false;
      return await bcrypt.compare(userPass, dbPass);
    } catch (err) {
      console.error("Error check user", (err as Error)?.message);
      throw err;
    }
  }
}
