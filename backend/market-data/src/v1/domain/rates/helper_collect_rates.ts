import RatesModel from "../../infrastructure/integrations/rates/ratesApi.js";
import { syncRedis } from "../../infrastructure/storage/redis/redis.repository.js";
import type { NormalizedRate } from "../../infrastructure/integrations/rates/rates.type.js";

//-------------------------------------------------------------------------------------//

export async function allRates(): Promise<NormalizedRate[]> {
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
    await syncRedis("banks-rates", allRates, 28800);
  }

  console.log(`✅ Курсы собраны: ${allRates.length} записей`);
  return allRates;
}
