import type { Request, Response, NextFunction } from "express";
import Stripe from "stripe"
import { moviesObj } from "../dao/movies.dao";
import { fulfillCheckout } from "../payment/stripe";
import { paymentObj } from "../redis-query/payment-query";
import type { BookingObj } from "./transaction.controller";
import { v4 as uuidv4 } from 'uuid';
import { transactionObj } from "../dao/transaction.dao";
import { ticketObj } from "../dao/ticket.dao";
import { bookingObj } from "../dao/booking.dao";
import "dotenv/config"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export const checkoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { datas }: {datas: BookingObj} = req.body;
      
      if (datas.bookingId){
        const tickets = await ticketObj.getPaidTicket(datas.bookingId!)
        if (tickets > 0){
          return res.status(400).json({seatTaken: true})
        }

        const transactions = await transactionObj.getTransactionMethod("Stripe", datas.bookingId!)
        if (transactions > 0){
          return res.status(400).json({transactionMethodPicked: true})
        }

        const bookingData = await bookingObj.getBookingStatus(datas.bookingId)
        if (bookingData?.status !== "PENDING"){
            return res.status(400).json({bookingExpire: true})
        }
      }
      
      const movie = await moviesObj.getSpecificMovie(datas.movieId!)
      const amountIncents = res.locals.amount
      const userId = req.user?.id as string
      const email = req.user?.email as string
      
      const bookingId = datas.bookingId || uuidv4()
      const transactionId = uuidv4()
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [
          {
            price_data:{
              currency: "vnd",
              product_data:{
                name: `${movie?.title}'s ticket`,
                description: `Booking id: ${bookingId}`
              },
              unit_amount: amountIncents
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: bookingId,
          userId: userId,
          userEmail: email,
          showTimeId: datas.showtimeId,
          transactionId: transactionId,
          totalAmount:amountIncents
        },
        mode: 'payment',
        success_url: `http://localhost:5173/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/payment/cancel?session_id={CHECKOUT_SESSION_ID}`
      }); 

      await paymentObj.setCheckoutSession(session.id, userId)
      const booking = {id: bookingId, seats: datas.seats,showtimeId: datas.showtimeId, snacks: datas.snacks, vouchers: datas.vouchers}
      const transaction = {id: transactionId, bookingId: bookingId, provider: "Stripe", providerTransactionId: session.id, amount: amountIncents}

      if (datas.bookingId){
        await transactionObj.createTransaction(transaction)
      } else{
        await transactionObj.createTransactionAndBooking(booking, transaction, userId)
      }

      res.locals.redirectUrl = session.url
      res.locals.bookingId = bookingId
      return next()
    } catch (error) {
      next(error)
    }
}

export const checkoutPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string
        const payload = req.body;
        const sig: any = req.headers['stripe-signature'];
        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err: any) {
            return res.status(400).json(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
            const session = event.data.object.metadata
            await fulfillCheckout(event.data.object.id, 
              session?.bookingId as string, 
              session?.userId as string, 
              session?.userEmail as string,
              session?.transactionId as string,
              Number(session?.totalAmount))
              
            res.locals.showTimeId = session?.showTimeId as string
            res.locals.transactionId = session?.transactionId as string
            res.locals.userId = session?.userId as string 
            return next()
          }

        return res.status(200).end();
    } catch(error) {
        next(error)
    }
}

export const cancelCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const sessionId = req.params.sessionId
    await paymentObj.deleteCheckoutSession(sessionId as string)
    return res.status(200).json({ success: true})
  } catch(error){
    next(error)
  }
}