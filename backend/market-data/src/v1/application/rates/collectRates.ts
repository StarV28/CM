import { allRates } from "../../domain/rates/helper_collect_rates.js";

//-------------------------------------------------------------------------------------//
export async function collectRates(): Promise<void> {
  await allRates();
}
