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
    type VerifyReturnUrl,

dateFormat} from "vnpay";
import { v4 as uuidv4 } from 'uuid'
import { sendTicket } from "../service/ticket-mail";
import type { BookingObj } from "./transaction.controller";
import { transactionObj } from "../dao/transaction.dao";
import { paymentObj } from "../redis-query/payment-query";
import { profileObj } from "../dao/profile.dao";
import { matchedData } from "express-validator";
export const vnpayCheckout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { datas }: {datas: BookingObj} = req.body

        if (datas.bookingId){
            const ticketData = await ticketObj.getPaidTicket(datas.bookingId)
            if (ticketData > 0){
                return res.status(400).json({seatTaken: true})
            }
            const transactions = await transactionObj.getTransactionMethod("vnpay", datas.bookingId)
            if (transactions > 0){
                return res.status(400).json({transactionMethodPicked: true})
            }

            const bookingData = await bookingObj.getBookingStatus(datas.bookingId)
            if (bookingData?.status !== "PENDING"){
                return res.status(400).json({bookingExpire: true})
            }
        }

        const userId = req.user?.id as string
        const amount = res.locals.amount
        const returnUrl = 'http://localhost:5173/payment/vnpay  '
        const expireDate = new Date()
        expireDate.setMinutes(expireDate.getMinutes() + 5)
        const transactionId = uuidv4()
        const bookingId = datas.bookingId || uuidv4()

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr:
                    req.headers['x-forwarded-for'] as string ||
                    req.connection.remoteAddress as string||
                    req.socket.remoteAddress as string ||
                    req.ip as string, 
            vnp_TxnRef: transactionId,
            vnp_OrderInfo: `Thanh toan don hang ${transactionId}`,
            vnp_OrderType: ProductCode.Entertainment_Training,
            vnp_ReturnUrl: returnUrl,
            vnp_Locale: VnpLocale.VN,
            vnp_ExpireDate: dateFormat(expireDate),
        },
    )
        const url = new URL(paymentUrl)
        const params = new URLSearchParams(url.search)
        const sessionId = params.get("vnp_SecureHash")
        await paymentObj.setCheckoutSession(sessionId!, userId)
        const booking = {id: bookingId, seats: datas.seats,showtimeId: datas.showtimeId, snacks: datas.snacks, vouchers: datas.vouchers}
        const transaction = {id: transactionId, bookingId: bookingId, provider: "vnpay", providerTransactionId: sessionId!, amount: amount}

        if (datas.bookingId){
            await transactionObj.createTransaction(transaction)
        } else{
            await transactionObj.createTransactionAndBooking(booking, transaction, userId)
        }

        res.locals.bookingId = bookingId
        res.locals.vnpayPaymentUrl = paymentUrl
        next()
    } catch (error) {
        next(error)
    }
}

export const ipnUrlProccess = async (req: any, res: Response, next: NextFunction) => {
    try{
        const verify: VerifyReturnUrl = vnpay.verifyIpnCall(req.query);
        if (!verify.isVerified) {
            await transactionObj.updateTransactionStatus(verify.vnp_TxnRef, "FAILED")
            return res.status(400).json(IpnFailChecksum);
        }

        if (!verify.isSuccess) {
            await transactionObj.updateTransactionStatus(verify.vnp_TxnRef, "CANCELLED")
            return res.status(400).json(IpnUnknownError)
        }

        const data = await transactionObj.getTransactionInfo(verify.vnp_TxnRef); 
        if (!data || verify.vnp_TxnRef !== data.id) {
            return res.status(400).json(IpnOrderNotFound);
        }

        if (data.status === "CANCELLED"){
            return res.status(400).json(InpOrderAlreadyConfirmed)
        }

        if (verify.vnp_Amount !== data.amount.toNumber()) {
            await transactionObj.updateTransactionStatus(data.id, 'FAILED')
            return res.status(400).json(IpnInvalidAmount);
        }

        if (data.status === 'SUCCESS') {
            return res.status(200).json(InpOrderAlreadyConfirmed);
        }

        const userEmail = data.booking.user.email
        const seatsId = data.booking.seats.map(seat => seat.id)
        await ticketObj.createTicket(seatsId, data.bookingId)
        const tickets = await ticketObj.getTicketInfo(data.bookingId)
        await sendTicket(userEmail, tickets, data.bookingId)

        await transactionObj.updateTransactionSuccess(data.id, data.bookingId)
        await profileObj.updateProfileSpending(Number(data.amount), data.booking.user.id)

        res.locals.showTimeId = data.booking.showtimeId
        res.locals.userId = data.booking.user.id
        res.locals.transactionId = data.id
        res.locals.IpnSuccess = IpnSuccess
        return next()
    } catch (error) {
        return res.status(500).json(IpnUnknownError);
    }
}

export const getUrlReturn = async (req: any, res: Response, next: NextFunction) => {
    let verify: VerifyReturnUrl;
    try {
        verify = vnpay.verifyReturnUrl(req.query);
        if (!verify.isVerified) {
            return res.status(400).json({verified: false})
        }
        if (!verify.isSuccess) {
            return res.status(400).json({success: false})
        }
    } catch (error) {
        return next(error)
    }

    return res.status(200).json({ success: true })
}