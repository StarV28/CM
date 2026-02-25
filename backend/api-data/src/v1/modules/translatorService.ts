import { translate } from "google-translate-api-x";

export default class TranslatorService {
  async translatorDescription(text: string, to: string) {
    try {
      const result = await translate(text, { to });
      return result.text;
    } catch (err) {
      console.error("Error translator description:", err);
      throw err;
    }
  }
}
