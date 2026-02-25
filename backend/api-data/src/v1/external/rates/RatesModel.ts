import axios from "axios";
import redisClient from "../../../../db/connect_Redis.js";
// import dotenv from "dotenv";
// dotenv.config();
//--------------------------------------------------------------//
// Интерфейсы
interface NbuRates {
  rate: number;
  cc: string;
}

// interface MonoRate {
//   currencyCodeA: number;
//   currencyCodeB: number;
//   date: number;
//   rateBuy?: number;
//   rateSell?: number;
//   rateCross?: number;
// }

interface PrivatRate {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

interface NormalizedRate {
  bank: string;
  currency_code: string;
  base_currency: string;
  rate_buy: number | null;
  rate_sell: number | null;
  date: string;
}

//--------------------------------------------------------------//
class RatesModel {
  //---- NBU -------------------------------------------------------------------//
  static async getRatesNBU(): Promise<NormalizedRate[]> {
    try {
      const { data } = await axios.get(
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
      );

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const rates = data
        .filter((r: NbuRates) => ["USD", "EUR"].includes(r.cc))
        .map((r: NbuRates) => ({
          bank: "National Bank of Ukraine",
          currency_code: r.cc,
          base_currency: "UAH",
          rate_buy: r.rate,
          rate_sell: r.rate,
          date: now,
        }));
      return rates;
    } catch (err) {
      console.error("❌ Error getting rates NBU:", (err as Error).message);
      throw err;
    }
  }

  //---- Privat ----------------------------------------------------------------//
  static async getRatesPrivat(): Promise<NormalizedRate[]> {
    try {
      const { data } = await axios.get(
        "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
      );

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      const rates = data
        .filter((r: PrivatRate) => ["USD", "EUR", "GBP"].includes(r.ccy))
        .map((r: PrivatRate) => ({
          bank: "Privat Bank of Ukraine",
          currency_code: r.ccy,
          base_currency: r.base_ccy,
          rate_buy: parseFloat(r.buy),
          rate_sell: parseFloat(r.sale),
          date: now,
        }));
      return rates;
    } catch (err) {
      console.error(
        "❌ Error getting rates PrivatBank:",
        (err as Error).message
      );
      throw err;
    }
  }

  //---- Mono ------------------------------------------------------------------//
  // static async getRatesMono(): Promise<NormalizedRate[]> {
  //   try {
  //     const { data } = await axios.get("https://api.monobank.ua/bank/currency");

  //     const currencyMap: Record<number, string> = {
  //       980: "UAH",
  //       840: "USD",
  //       978: "EUR",
  //       826: "GBP",
  //       985: "PLN",
  //     };

  //     const rates = (data as MonoRate[])
  //       .filter(
  //         (r) =>
  //           [840, 978, 826, 985].includes(r.currencyCodeA) &&
  //           r.currencyCodeB === 980
  //       )
  //       .map((r) => ({
  //         bank: "Mono",
  //         currency_code: currencyMap[r.currencyCodeA],
  //         base_currency: currencyMap[r.currencyCodeB],
  //         rate_buy: r.rateBuy || r.rateCross || null,
  //         rate_sell: r.rateSell || r.rateCross || null,
  //         date: new Date(r.date * 1000)
  //           .toISOString()
  //           .slice(0, 19)
  //           .replace("T", " "),
  //       }));
  //     return rates;
  //   } catch (err) {
  //     console.error("Error getting rates MonoBank:", (err as Error).message);
  //     throw err;
  //   }
  // }
  // quotes;
  //-------------------------------------------------------------------------------------//
  static async getBankEuropeRates() {
    try {
      const myKey = process.env.EXCHANGERATE_HOST_API_KEY;
      if (!myKey) {
        throw new Error("Missing EXCHANGERATE_HOST_API_KEY in environment");
      }
      const { data } = await axios.get(
        `https://api.currencylayer.com/live?access_key=${myKey}&currencies=USD,EUR,TRY,INR,PLN`
      );

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      const needed = ["USDEUR", "USDTRY", "USDINR", "USDPLN"];

      const filtered = Object.entries(data.quotes)
        .filter(([key]) => needed.includes(key))
        .map(([pair, rate]) => ({
          bank: "World Rates",
          currency_code: pair,
          base_currency: data.base,
          rate_buy: Number(rate),
          rate_sell: Number(rate),
          date: now,
        }));
      filtered.map((pair) => {
        pair.currency_code = pair.currency_code.startsWith("USD")
          ? `USD/${pair.currency_code.slice(3)}`
          : pair.currency_code;
      });
      return filtered;
    } catch (err) {
      console.error("❌ Error getting rates Europe:", (err as Error).message);
      throw err;
    }
  }

  //---Banks----------------------------------------------------------------------------------//
  static async getAllRatesSafe(): Promise<NormalizedRate[]> {
    const tasks: Promise<NormalizedRate[]>[] = [
      RatesModel.getRatesNBU(),
      RatesModel.getRatesPrivat(),
      RatesModel.getBankEuropeRates(),
    ];

    const results = await Promise.allSettled(tasks);

    const safeGet = (
      r: PromiseSettledResult<NormalizedRate[]>
    ): NormalizedRate[] => (r.status === "fulfilled" ? r.value : []);

    const nbuRates = safeGet(results[0]);
    const privatRates = safeGet(results[1]);
    const europeRates = safeGet(results[2]);

    const allRates = [...nbuRates, ...privatRates, ...europeRates];

    if (allRates.length > 0) {
      const source = { key: "banks-rates", ttl: 28800 }; // 8 hours
      await redisClient.setex(source.key, source.ttl, JSON.stringify(allRates));
    }

    console.log(`✅ Курсы собраны: ${allRates.length} записей`);
    return allRates;
  }
}

export default RatesModel;
