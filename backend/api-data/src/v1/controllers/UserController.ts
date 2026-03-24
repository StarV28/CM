import { Request, Response, NextFunction } from "express";
import UsersModel from "../external/user/UserModule.js";
import { prepareToken } from "../../../utils/jwtHelpers.js";
import ItemDBService from "../modules/CRUD.js";
import { MailModule } from "../../../utils/mail.module.js";
import redisClient from "../../../db/connect_Redis.js";
import FavoriteService from "../modules//favoriteService.js";
import bcrypt from "bcrypt";

//-------------------------------------------------------------------------------------//

export default class UserController {
  //-------------------------------------------------------------------------------------//
  static async userCreateController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.body;

      const createdUser = await UsersModel.userCreate(user);
      if ("success" in createdUser && createdUser.success === false) {
        return res.status(200).json(createdUser);
      }
      // const headers = {
      //   "user-agent": req.headers["user-agent"]?.toString(),
      //   "accept-language": req.headers["accept-language"]?.toString(),
      // };

      const token = prepareToken({
        id: createdUser.id,
        email: createdUser.email,
      });

      return res.status(200).json({
        user: createdUser,
        token,
      });
    } catch (err) {
      console.error("Error create user controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//

  static async userLoginController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = req.body;
      const ipAttempts = req.body.ipAttempts;
      const userData = await ItemDBService.findOne("users", data.data.email);
      if (!userData)
        return res.status(200).json({
          success: false,
          message: "Incorrect email address or password.",
          attempts: ipAttempts,
        });

      // const headers = {
      //   "user-agent": req.headers["user-agent"]?.toString(),
      //   "accept-language": req.headers["accept-language"]?.toString(),
      // };

      const resultCheckPass = await UsersModel.userCheckLogIn(
        data.data.password,
        userData.password,
      );

      if (!resultCheckPass) {
        return res.status(200).json({
          success: false,
          message: "Incorrect email address or password.",
          attempts: ipAttempts,
        });
      }

      const favorites = await FavoriteService.getAllFavoriteCoinsUSer(
        userData.id,
      );
      const token = prepareToken({ id: userData.id, email: userData.email });

      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        locale: userData.locale,
        role: userData.role,
      };

      return res.status(200).json({
        success: true,
        user: user,
        token,
        favorites: favorites,
      });
    } catch (err) {
      console.error("Error create user controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//
  static async userChangePass(req: Request, res: Response, next: NextFunction) {
    try {
      const mail = new MailModule();
      const { email } = req.body.data;
      const ipAttempts = req.body.ipAttempts;
      const user = await ItemDBService.findOne("users", email);
      if (!user) {
        return res.status(200).json({
          success: false,
          message: "User with this email not found",
          attempts: ipAttempts ?? null,
        });
      }

      const randomNum = () =>
        Math.floor(100000 + Math.random() * 900000).toString();
      const code = randomNum();

      const id = user.id;
      const source = { key: "codePass", ttl: 300 };
      await redisClient.setex(
        source.key,
        source.ttl,
        JSON.stringify({ code, id }),
      );

      const text = `Your password reset code: ${code}`;

      await mail.sendCode(email, "Password Reset Code", text);

      return res
        .status(200)
        .json({ success: true, message: "Password reset email sent" });
    } catch (err) {
      console.error("Error change user password controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//
  static async getCheckedCodePass(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const codeUser = req.body.data.code;

      const cachedCode = (await redisClient.get("codePass")) as string | null;

      if (cachedCode) {
        const data =
          typeof cachedCode === "string" ? JSON.parse(cachedCode) : cachedCode;
        const id = data?.id;

        if (data && Number(codeUser) === Number(data?.code)) {
          return res.status(200).json({ success: true, id: id });
        }
      }

      return res.status(200).json({ success: false });
    } catch (err) {
      console.error("Error checked user code controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//
  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body.data;
      const id = req.body.id;
      const hashPass = await bcrypt.hash(data.password, 10);
      data.password = hashPass;

      const result = await ItemDBService.update("users", "id", id, data);
      if (!result) {
        return res.status(200).json({ success: false });
      } else {
        const favorites = await FavoriteService.getAllFavoriteCoinsUSer(id);
        const user = await ItemDBService.getByID("users", "id", id);
        const token = prepareToken({ id: user?.id, email: user?.email });
        if (user) {
          return res.status(200).json({
            success: true,
            user: user,
            favorites: favorites,
            token: token,
          });
        }
      }
    } catch (err) {
      console.error("Error checked user code controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body.data;
      const data = {
        name: userData.name ?? null,
        email: userData.email ?? null,
      };

      const id = userData.id;
      const user = await ItemDBService.update("users", "id", id, data);
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Error update User" });
      }
    } catch (err) {
      console.error("Error update user controller", err);
      next(err);
    }
  }
  //-------------------------------------------------------------------------------------//
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.query.id);
      const result = await ItemDBService.deleteById("users", "id", id);
      if (!result) {
        return res
          .status(200)
          .json({ success: false, message: "INvalid delete user" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Successful delete user" });
      }
    } catch (err) {
      console.error("Error delete user", (err as Error)?.message);
      next(err);
    }
  }
}
