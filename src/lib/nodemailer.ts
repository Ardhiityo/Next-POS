import { environment } from "@/configs/environment";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
    secure: environment.SMTP_SECURE,
    auth: {
        user: environment.SMTP_USER,
        pass: environment.SMTP_PASS,
    },
});