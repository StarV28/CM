import axios from "axios";

export class TelegramModule {
  botToken: string;
  chatId: string;

  constructor(botToken?: string, chatId?: string) {
    this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN || "";
    this.chatId = chatId || process.env.TELEGRAM_CHAT_ID || "";
  }

  async sendMessage(message: string): Promise<void> {
    const now = new Date().toISOString().slice(0, 19).replace("T", " Time: ");

    if (!this.botToken || !this.chatId) {
      console.warn("Telegram bot token or chat ID is missing");
      return;
    }

    const safeMessage =
      typeof message === "string" ? message : JSON.stringify(message, null, 2);

    const formattedMessage = `
    <b>Date: ${now}</b>
    ==========================
    ${safeMessage}
    ==========================
    `;

    try {
      await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: this.chatId,
          text: formattedMessage,
          parse_mode: "HTML",
        }
      );
    } catch (err) {
      console.error("Failed to send Telegram message:", err);
    }
  }
}
