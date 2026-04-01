import { vnpay } from "../payment/vnpay";
import type { Request, Response, NextFunction } from "express";
import { bookingObj } from "../dao/booking.dao";
import { ticketObj } from "../dao/ticket.dao";
import { ProductCode, 
    VnpLocale, 
    type VerifyIpnCall, 
    IpnFailChecksum, 
    IpnOrderNotFound, 
    IpnInvalidAmount,
    InpOrderAlreadyConfirmed, 
    IpnUnknownError, 
    IpnSuccess, 
    type VerifyReturnUrl} from "vnpay";
import { seatLockObj } from "../redis-query/seat-lock-query";
import { sendTicket } from "../service/ticket-mail";

export const vnpayCheckout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId }: {bookingId: string} = req.body;
        const data = await bookingObj.getBooking(bookingId)
        const returnUrl = 'http://localhost:5173/payment/complete'
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: data?.totalAmount.toNumber()!,
            vnp_IpAddr:
                    req.headers['x-forwarded-for'] as string ||
                    req.connection.remoteAddress as string||
                    req.socket.remoteAddress as string ||
                    req.ip as string, 
            vnp_TxnRef: data?.id as string,
            vnp_OrderInfo: `Thanh toan don hang ${data?.id}`,
            vnp_OrderType: ProductCode.Entertainment_Training,
            vnp_ReturnUrl: returnUrl,
            vnp_Locale: VnpLocale.VN,
        })
        res.locals.vnpayPaymentUrl = paymentUrl
        res.locals.paymentData = data
        next()
    } catch (error) {
        next(error)
    }
}

export const ipnUrlProccess = async (req: any, res: Response, next: NextFunction) => {
    try{
        const verify: VerifyReturnUrl = vnpay.verifyIpnCall(req.query);
        if (!verify.isVerified) {
            await bookingObj.updateBookingStatus(verify.vnp_TxnRef, "FAILED")
            return res.status(400).json(IpnFailChecksum);
        }

        if (!verify.isSuccess) {
            await bookingObj.updateBookingStatus(verify.vnp_TxnRef, "CANCELLED")
            const data = await bookingObj.getBooking(verify.vnp_TxnRef)
            const seatIds = data?.seats.map((seat) => seat.id)
            for (const seatId of seatIds!){
                await seatLockObj.unlockSeat(data?.showtime.id!, seatId)
            }
            return res.status(400).json(IpnUnknownError);
        }

        // Tìm đơn hàng trong cơ sở dữ liệu
        const data = await bookingObj.getBooking(verify.vnp_TxnRef); // Phương thức tìm đơn hàng theo id, bạn cần tự triển khai

        // Nếu không tìm thấy đơn hàng hoặc mã đơn hàng không khớp
        if (!data || verify.vnp_TxnRef !== data.id) {
            return res.status(400).json(IpnOrderNotFound);
        }

        // Nếu số tiền thanh toán không khớp
        if (verify.vnp_Amount !== data.totalAmount.toNumber()) {
            await bookingObj.updateBookingStatus(data.id, 'FAILED')
            return res.status(400).json(IpnInvalidAmount);
        }

        // Nếu đơn hàng đã được xác nhận trước đó
        if (data.status === 'CONFIRMED') {
            return res.status(200).json(InpOrderAlreadyConfirmed);
        }

        const userEmail = data.user.email
        const seatsId = data.seats.map(seat => seat.id)
        await ticketObj.createTicket(seatsId, data.id)
        const tickets = await ticketObj.getTicketInfo(data.id)
        await sendTicket(userEmail, tickets, data.id)

        await bookingObj.updateBookingStatus(data.id, 'CONFIRMED');
        return res.status(200).json(IpnSuccess);
    } catch (error) {
        return res.status(500).json(IpnUnknownError);
    }
}

export const getUrlReturn = async (req: any, res: Response, next: NextFunction) => {
    let verify: VerifyReturnUrl;
    try {
        verify = vnpay.verifyReturnUrl(req.query);
        if (!verify.isVerified) {
            return res.status(400).json({message: "Failed verification"})
        }
        if (!verify.isSuccess) {
            return res.status(400).json({success: false})
        }
    } catch (error) {
        return next(error)
    }

    return res.status(200).json({ success: true })
}