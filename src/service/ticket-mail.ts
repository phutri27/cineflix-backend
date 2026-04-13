import nodemailer from 'nodemailer'
import QRCode from 'qrcode'
import { type TicketResponse } from '../dao/ticket.dao'
import { uploadBufferFile } from '../utils/fileupload'
import { ticketObj } from '../dao/ticket.dao'
export const sendTicket = async (userEmail: string, tickets: TicketResponse[], bookingId: string) => {
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

    let htmlContent = ''
    for (const ticket of tickets) {
        htmlContent += `
            <h2>Movie: ${ticket.movie}</h2>
            <p>Showtime: ${ticket.showtime}</p>
            <p>Seat: ${ticket.seat}</p>
            <p>Screen: ${ticket.screen}</p>
            <p>Cinema: ${ticket.cinema}</p>
            <img src="cid:${ticket.id}@gmail.com" alt="QR Code for Ticket ID ${ticket.id}" />
            <hr/>
        `
    }

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
        from: `"Test App" <${testAccount.user}>`,
        to: userEmail,
        subject: `Your Tickets for Booking #${bookingId}`,
        text: 'Please find your QR code ticket attached.',
        html: htmlContent,
        attachments: attach
    })

    console.log("Message sent: %s", ticketMessage.messageId);
    console.log("Preview: %s", nodemailer.getTestMessageUrl(ticketMessage));
}