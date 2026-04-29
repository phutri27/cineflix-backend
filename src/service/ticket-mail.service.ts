import nodemailer from 'nodemailer'
import QRCode from 'qrcode'
import type { TicketResponse } from '../types/ticket-types.js'
import { uploadBufferFile } from '../utils/cloudinary-file.util.js'
import { ticketObj } from '../dao/ticket.dao.js'
import "dotenv/config"
const generateTicketHTML = (tickets: TicketResponse[], bookingId: string) => {
    const ticketRows = tickets.map((ticket) => `
        <tr>
            <td style="padding:24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;overflow:hidden;">
                    <tr>
                        <td style="padding:20px 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="vertical-align:top;width:60%;">
                                        <h3 style="margin:0 0 12px;color:#ffffff;font-size:18px;font-weight:800;">
                                            ${ticket.movie}
                                        </h3>
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:4px 0;color:#737373;font-size:12px;font-weight:600;width:80px;vertical-align:top;">Cinema</td>
                                                <td style="padding:4px 0;color:#e5e5e5;font-size:12px;font-weight:700;">${ticket.cinema}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;color:#737373;font-size:12px;font-weight:600;width:80px;vertical-align:top;">Screen</td>
                                                <td style="padding:4px 0;color:#e5e5e5;font-size:12px;font-weight:700;">${ticket.screen}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;color:#737373;font-size:12px;font-weight:600;width:80px;vertical-align:top;">Showtime</td>
                                                <td style="padding:4px 0;color:#e5e5e5;font-size:12px;font-weight:700;">${ticket.showtime}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;color:#737373;font-size:12px;font-weight:600;width:80px;vertical-align:top;">Seat</td>
                                                <td style="padding:4px 0;">
                                                    <span style="color:#ffffff;font-size:14px;font-weight:900;background-color:#dc2626;padding:2px 10px;border-radius:4px;">
                                                        ${ticket.seat}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align:middle;text-align:right;width:40%;">
                                        <div style="display:inline-block;padding:12px;background-color:#ffffff;border-radius:8px;">
                                            <img src="cid:${ticket.id}@gmail.com" alt="QR Code" width="120" height="120" style="display:block;" />
                                        </div>
                                        <p style="margin:8px 0 0;color:#525252;font-size:10px;text-align:center;">
                                            Scan to verify
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 24px;">
                            <div style="border-top:2px dashed #2a2a2a;"></div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:12px 24px;">
                            <p style="margin:0;color:#404040;font-size:10px;font-weight:600;letter-spacing:1px;">
                                TICKET ID: ${ticket.id}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join("")

    return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="520" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
                        <tr>
                            <td style="background-color:#dc2626;padding:24px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:2px;">
                                    CINEFLIX
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px 32px 0;">
                                <h2 style="margin:0 0 8px;color:#ffffff;font-size:20px;font-weight:700;">
                                    Your Tickets Are Ready! 🎬
                                </h2>
                                <p style="margin:0 0 4px;color:#737373;font-size:13px;line-height:1.6;">
                                    Booking confirmed. Show the QR code at the entrance for quick check-in.
                                </p>
                                <p style="margin:0;color:#525252;font-size:11px;">
                                    Booking #${bookingId}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 32px 32px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    ${ticketRows}
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0 32px 28px;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;">
                                    <tr>
                                        <td style="padding:16px 20px;">
                                            <p style="margin:0 0 8px;color:#d97706;font-size:12px;font-weight:800;letter-spacing:1px;">
                                                ⚠️ REMINDERS
                                            </p>
                                            <p style="margin:0;color:#737373;font-size:12px;line-height:1.8;">
                                                • Arrive at least 15 minutes before showtime<br/>
                                                • Have your QR code ready at the entrance<br/>
                                                • No outside food or drinks allowed<br/>
                                                • Tickets are non-transferable
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px;border-top:1px solid #2a2a2a;text-align:center;">
                                <p style="margin:0 0 4px;color:#404040;font-size:11px;">
                                    Need help? Contact us at <span style="color:#737373;">1900 6868</span>
                                </p>
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
    `
}

export const sendTicket = async (userEmail: string, tickets: TicketResponse[], bookingId: string) => {
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

    const attach = await Promise.all(tickets.map(async (ticket) => {
        const qrData = `Ticket ID: ${ticket.id}\nMovie: ${ticket.movie}\nShowtime: ${ticket.showtime}\nSeat: ${ticket.seat}\nScreen: ${ticket.screen}\nCinema: ${ticket.cinema}`
        const qrCodeImage = await QRCode.toBuffer(qrData)
        const folderUrl = `movies_ticket/${ticket.cinema}/${ticket.screen}/${ticket.showtime}`
        const result: any = await uploadBufferFile(qrCodeImage, folderUrl)
        await ticketObj.insertTicketUrl(ticket.id, result.secure_url)
        return {
            filename: `ticket-${ticket.id}.png`,
            content: qrCodeImage,
            cid: `${ticket.id}@gmail.com`
        }
    }))

    const ticketMessage = await transporter.sendMail({
        from: `Cineflix <${process.env.GOOGLE_USER}>`,
        to: userEmail,
        subject: `Your Tickets for Booking #${bookingId}`,
        text: 'Please find your QR code ticket attached.',
        html: generateTicketHTML(tickets, bookingId),
        attachments: attach
    })
}