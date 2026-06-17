import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .env
dotenv.config({
    path: path.join(__dirname, "../.env"),
});

console.log(process.env.SMTP_HOST);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendMail() {

    try {

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: "YOUR_EMAIL@gmail.com",
            subject: "OTP Test",
            html: "<h2>Your OTP is 123456</h2>",
        });

        console.log("Email Sent Successfully!");
        console.log(info.messageId);

    } catch (error) {

        console.log("Error:", error.message);
    }
}

sendMail();