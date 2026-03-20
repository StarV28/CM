import { OAuth2Client } from "google-auth-library";
import { Request, Response, NextFunction } from "express";
import config from "../../../config/index.js";
import ItemDBService from "../modules/CRUD.js";
import { prepareToken, parseBearer } from "../../../utils/jwtHelpers.js";
import { User } from "../modules/types/user.js";
import FavoriteService from "../modules/favoriteService.js";

const client = new OAuth2Client(
  config.authGoogle?.clientId,
  config.authGoogle?.clientSecret,
  `${config.url.api_url}/auth/google/callback`,
);

export const googleAuthRedirect = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const locale = req.query.locale?.toString();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["profile", "email"],
      state: locale,
    });

    return res.redirect(url);
  } catch (error) {
    console.error("Error redirect user to Google", (error as Error)?.message);
    next(error);
  }
};

export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const codeRaw = req.query.code;
    let code: string | undefined;

    if (typeof codeRaw === "string") {
      code = codeRaw;
    } else if (Array.isArray(codeRaw) && typeof codeRaw[0] === "string") {
      code = codeRaw[0];
    } else {
      code = undefined;
    }

    if (!code) return next(new Error("Google OAuth code missing"));

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) return next(new Error("ID token missing"));

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.authGoogle?.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) return next(new Error("Email not provided by Google"));

    const userEmail = payload.email;

    let user: User | null = await ItemDBService.findOne("users", userEmail);

    const locale = req.query.state?.toString() || "en";

    if (!user) {
      const created = await ItemDBService.create("users", {
        email: payload.email,
        name: payload.name ?? null,
        locale: locale,
      });
      if (!created) return next(new Error("User creation failed"));

      user = {
        id: created.insertId,
        email: payload.email,
        name: payload.name ?? null,
      };
    }

    // const headers = {
    //   "user-agent": req.headers["user-agent"]?.toString(),
    //   "accept-language": req.headers["accept-language"]?.toString(),
    // };

    const token = prepareToken({ id: user.id, email: user.email });

    const path =
      locale === "en"
        ? `/auth/login?token=${token}`
        : `/${locale}/auth/login?token=${token}`;

    return res.redirect(`${config.url.frontend_url}${path}`);
  } catch (error) {
    console.error("Google OAuth Error:", (error as Error)?.message);
    next(error);
  }
};

export const googleAnswerMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    let decoded;
    try {
      decoded = parseBearer(authHeader);
    } catch (err) {
      console.error("Error decoded token", (err as Error)?.message);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = decoded.id as number | undefined;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const userData = await ItemDBService.getByID("users", "id", userId);
    const favorites = await FavoriteService.getAllFavoriteCoinsUSer(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };
    res.json({
      user: user,
      locale: userData.locale ?? null,
      favorites: favorites ?? null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
