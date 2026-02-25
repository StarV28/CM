import { allEx } from "../../domain/exchanges/helper_collect_data.js";

//-------------------------------------------------------------------------------------//
export async function collectEx(): Promise<void> {
  await allEx();
}
