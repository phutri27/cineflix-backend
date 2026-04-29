import nodemailer from 'nodemailer'
import { OTPobj } from '../redis-query/otp-query.js'
import { generateOTP } from '../utils/generateOTP.util.js'
import "dotenv/config"
export const sendEmail = async(userEmail: string, userCred: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        },
    });

    const otp = generateOTP()
    
    const info = await transporter.sendMail({
    from: `"Cineflix" <${process.env.GOOGLE_USER}>`,
    to: userEmail,
    subject: "Your Cineflix OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 15 minutes.`,
    html: `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
                        <tr>
                            <td style="background-color:#dc2626;padding:24px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:2px;">
                                    CINEFLIX
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px 32px;">
                                <h2 style="margin:0 0 8px;color:#ffffff;font-size:20px;font-weight:700;">
                                    Password Reset
                                </h2>
                                <p style="margin:0 0 28px;color:#737373;font-size:14px;line-height:1.6;">
                                    Use the code below to reset your password. This code will expire in <strong style="color:#a3a3a3;">15 minutes</strong>.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:24px;background-color:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;">
                                            <p style="margin:0 0 8px;color:#737373;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">
                                                YOUR OTP CODE
                                            </p>
                                            <h1 style="margin:0;color:#dc2626;font-size:36px;font-weight:900;letter-spacing:8px;">
                                                ${otp}
                                            </h1>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin:28px 0 0;color:#525252;font-size:12px;line-height:1.6;">
                                    ⚠️ If you did not request this code, please ignore this email. Do not share this code with anyone.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px;border-top:1px solid #2a2a2a;text-align:center;">
                                <p style="margin:0;color:#404040;font-size:11px;">
                                    © ${new Date().getFullYear()} Cineflix. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
    });

    await OTPobj.saveOTP(otp, userCred)
}