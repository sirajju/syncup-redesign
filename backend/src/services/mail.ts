import Elysia from "elysia";
import { createTransport } from "nodemailer";
import logger from "./logger";

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_ID,
    pass: process.env.MAILER_PASSWORD,
  },
})
  .on("error", (err) => {
    logger.error(`Error while smtp connection ${err.message}`);
  })
  .on("token", (token) => {
    logger.info(`SMTP auth token init ${token}`);
  });

export const mailService = new Elysia().decorate("mailer", {
  async sendMail(payload: { to: string; subject: string; text: string }) {
    const { to, subject, ...options } = payload;

    logger.info(`Sending mail ${to}`)

    try {
      const info = await transporter.sendMail({
        from: process.env.MAILER_ID,
        to,
        subject,
        ...options,
      });

      logger.info(`Mail ${JSON.stringify(payload)} sent to ${to}`);

      return info;
    } catch (error) {
      logger.error("Error sending email:", error);
    }
  },
});
