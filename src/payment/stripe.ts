import Stripe from "stripe"
import { paymentObj } from "../redis-query/payment-query";
import { bookingObj } from "../dao/booking.dao";
import { ticketObj } from "../dao/ticket.dao";
import { sendTicket } from "../service/ticket-mail";
import { seatLockObj } from "../redis-query/seat-lock-query";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function fulfillCheckout(sessionId: string, bookingId: string, userId: string, seatIds: string, userEmail: string) {
  console.log("booking Id: ", bookingId)
  console.log("seatIds", JSON.parse(seatIds))
  console.log("Email: ", userEmail)
  // TODO: Make this function safe to run multiple times,
  // even concurrently, with the same session ID
  const result = await paymentObj.setPaymentSession(sessionId, userId)
  if (!result){
    return 
  }

  // TODO: Make sure fulfillment hasn't already been
  // performed for this Checkout Session
  const data = await bookingObj.getBookingStatus(bookingId)
  if (data?.status === "CONFIRMED"){
    return
  }

  // Retrieve the Checkout Session from the API with line_items expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  // Check the Checkout Session's payment_status property
  // to determine if fulfillment should be performed
  if (checkoutSession.payment_status !== 'unpaid') {
    // TODO: Perform fulfillment of the line items
    const seatIdsArr = JSON.parse(seatIds) as string[]
    await ticketObj.createTicket(seatIdsArr, bookingId)
    const tickets = await ticketObj.getTicketInfo(bookingId)
    await sendTicket(userEmail, tickets, bookingId)
    
    // TODO: Record/save fulfillment status for this
    // Checkout Session
    
    await bookingObj.insertSessionId(bookingId, sessionId)
    await bookingObj.updateBookingStatus(bookingId, 'CONFIRMED')

  }
}