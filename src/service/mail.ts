import nodemailer from 'nodemailer'
import { OTPobj } from '../redis-query/otp-query'
import { generateOTP } from './generteOTP'

export const sendEmail = async(userEmail: string, userCred: string) => {
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
        user: testAccount.user,
        pass: testAccount.pass,
        },
    });

    const otp = generateOTP()
    
    const info = await transporter.sendMail({
        from: `"Test App" <${testAccount.user}>`,
        to: userEmail,
        subject: "Changing password OTP",
        text: "Please type this OTP in to change password. OTP will expire after 15 minutes",
        html: `<h1>Please type this OTP in</h1>
        <h2>${otp}</h2>`,
    });

    await OTPobj.saveOTP(otp, userCred)

    console.log("Message sent: %s", info.messageId);
    console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}