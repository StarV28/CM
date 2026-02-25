import { Request, Response, NextFunction } from "express";
import CoinsMode from "../external/coins/CoinsModel.js";
import ItemDBService from "../modules/CRUD.js";
import TranslatorService from "../modules/translatorService.js";
import type { CoinDescRow, Locale } from "../modules/types/coin.js";
import { createDescCoin } from "../tables/descCoin-table.js";
import getPool from "../../../db/connect_MySQL.js";

//-------------------------------------------------------------------------------------//

class CoinsController {
  //-----Top 50 coins--------------------------------------------------------------------------------//
  static async getTopCoinsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : null;
      const favorites = req.query.favorites as string | undefined;
      const favoriteIds = favorites
        ? favorites
            .split(",")
            .map((id) => Number(id))
            .filter(Number.isFinite)
        : [];

      const result = await CoinsMode.getCoinsTop(limit, favoriteIds);
      return res.json({ result });
    } catch (err) {
      console.error("Error fetching top coins:", err);
      next(err);
    }
  }
  //---Coins_ID----------------------------------------------------------------------------------//
  static async getCoinIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;
      const coin = await ItemDBService.getByID("coins", "cmc_id", id);
      return res.status(200).json({ result: coin });
    } catch (err) {
      next(err);
    }
  }
  //-------Translator Description-------------------------------------------------------//

  static async getDescriptionController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const pool = await getPool();
    try {
      const id = Number(req.params.id);
      const locale = ((req.query.locale as string) || "en") as Locale;

      const [rows] = await pool.query(`SHOW TABLES LIKE 'coins_description'`);
      if (!rows || (Array.isArray(rows) && rows.length <= 0)) {
        await createDescCoin();
      }

      let descRow = await ItemDBService.getByID<CoinDescRow>(
        "coins_description",
        "id",
        id,
      );

      if (!descRow) {
        descRow = { id: id };
        await ItemDBService.create("coins_description", descRow);
      }

      if (descRow[locale]) {
        return res.status(200).json({ description: descRow[locale] });
      }

      let originalEn = descRow.en;
      if (!originalEn) {
        const result = await CoinsMode.getDescriptionCoin(id);
        originalEn = result?.description;
        const symbol = result?.symbol;

        await ItemDBService.update("coins_description", "id", id, {
          symbol: symbol,
          en: originalEn,
        });
      }

      const description = await CoinsController.getDescription(id, locale);

      await ItemDBService.update("coins_description", "id", id, {
        [locale]: description,
      });

      return res.status(200).json({ description });
    } catch (err) {
      next(err);
    }
  }

  //---Mapping Land----------------------------------------------------------------------------------//
  private static mapLocale(locale: string) {
    const mapping: Record<string, string> = {
      en: "en",
      ua: "uk",
      de: "de",
      tr: "tr",
      hi: "hi",
    };
    return mapping[locale] || "en";
  }

  //-----Private method translator-----------------------------------------------------//
  private static async getDescription(id: number, locale: Locale) {
    try {
      const translator = new TranslatorService();
      const result = await CoinsMode.getDescriptionCoin(id);

      let description = result?.description;
      if (description) {
        const correctLocale = CoinsController.mapLocale(locale);
        description = await translator.translatorDescription(
          description,
          correctLocale,
        );
      }

      return description;
    } catch (err) {
      console.error(
        "Error private method translator description",
        (err as Error)?.message,
      );
    }
  }
}

export default CoinsController;
