import { exOrchestrator } from "../../infrastructure/integrations/exServices/exOrchestrator.js";

//-------------------------------------------------------------------------------------//
export async function collectExData() {
  return await exOrchestrator();
}
