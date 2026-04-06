import { paymentObj } from "../redis-query/payment-query";
import { bookingObj } from "../dao/booking.dao";
import { ticketObj } from "../dao/ticket.dao";
import { sendTicket } from "../service/ticket-mail";
import { stripe  } from "../controller/stripe.controller";
import "dotenv/config"
import { transactionObj } from "../dao/transaction.dao";

  export async function fulfillCheckout(sessionId: string, 
    bookingId: string, 
    userId: string,  
    userEmail: string,
    transactionId: string) {

    const result = await paymentObj.setPaymentSession(sessionId, userId)
    if (!result){
      return 
    }

    // TODO: Make sure fulfillment hasn't already been
    // performed for this Checkout Session
    const data = await bookingObj.getBookingStatus(bookingId)
    if (data?.status === "PAID"){
      return
    }

    // Retrieve the Checkout Session from the API with line_items expanded
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

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be performed
    if (checkoutSession.payment_status !== 'unpaid') {
      // TODO: Perform fulfillment of the line items
      const seatIds = await bookingObj.getBookingSeats(bookingId)
      const seatIdsArr = seatIds?.seats.map((seat) => seat.id)
      await ticketObj.createTicket(seatIdsArr!, bookingId)
      const tickets = await ticketObj.getTicketInfo(bookingId)
      await sendTicket(userEmail, tickets, bookingId)
      // TODO: Record/save fulfillment status for this
      // Checkout Session
      await transactionObj.updateTransactionSuccess(transactionId, bookingId)
    }
  }