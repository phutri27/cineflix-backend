import { paymentObj } from "../redis-query/payment-query";
import { bookingObj } from "../dao/booking.dao";
import { ticketObj } from "../dao/ticket.dao";
import { sendTicket } from "./ticket-mail.service";
import { stripe } from "../config/stripe";
import "dotenv/config"
import { transactionObj } from "../dao/transaction.dao";
import { profileObj } from "../dao/profile.dao";
export async function fulfillCheckout(sessionId: string, 
    bookingId: string, 
    userId: string,  
    userEmail: string,
    transactionId: string,
    amount: number) {

    const result = await paymentObj.setPaymentSession(sessionId, userId)
    if (!result){
      return 
    }

    const data = await bookingObj.getBookingStatus(bookingId)
    if (data?.status === "PAID"){
      return
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    
    const transaction = await transactionObj.getTransactionInfo(transactionId)
    if (transaction?.status === "SUCCESS"){
      return 
    }
    if (transaction?.status === "CANCELLED"){
      if (checkoutSession.status === 'complete') {
        return; 
      }
      if (checkoutSession.status === 'open') {
        await stripe.checkout.sessions.expire(sessionId!);
      }
    }

    if (checkoutSession.payment_status !== 'unpaid') {
      const seatIds = await bookingObj.getBookingSeats(bookingId)
      const seatIdsArr = seatIds?.seats.map((seat) => seat.id)
      await ticketObj.createTicket(seatIdsArr!, bookingId)
      const tickets = await ticketObj.getTicketInfo(bookingId)
      
      await sendTicket(userEmail, tickets, bookingId)
      await transactionObj.updateTransactionSuccess(transactionId, bookingId)
      await profileObj.updateProfileSpending(amount, userId)
    }
  }