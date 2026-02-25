import nodemailer from "nodemailer";
import config from "../config/index.js";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Создание транспортера
const transporter = nodemailer.createTransport({
  service: "gmail", // можно вынести в config
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export class MailModule {
  async sendMail(options: MailOptions): Promise<boolean> {
    try {
      const info = await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      console.log("Email sent:", info.response);
      return true;
    } catch (err) {
      console.error("Error sending email:", err);
      return false;
    }
  }
  //-------------------------------------------------------------------------------------//

  async sendError(to: string, subject: string, message: string): Promise<void> {
    await this.sendMail({
      from: `"Error Logger" <${config.email.user}>`,
      to,
      subject,
      text: message,
      html: `<pre>${message}</pre>`,
    });
  }
  //-------------------------------------------------------------------------------------//
  async sendCode(to: string, subject: string, message: string): Promise<void> {
    await this.sendMail({
      from: `"Code change Password" <${config.email.user}>`,
      to,
      subject,
      text: message,
      html: `<pre>${message}</pre>`,
    });
  }
}
