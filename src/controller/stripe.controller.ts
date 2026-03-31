import type { Request, Response, NextFunction } from "express";
import Stripe from "stripe"
import { bookingObj } from "../dao/booking.dao";
import { fulfillCheckout } from "../payment/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export const checkoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookingId, seatIds }: {bookingId: string, seatIds: string[]} = req.body;
      const data = await bookingObj.getBooking(bookingId)
      const amountIncents = Number(data?.totalAmount)
      const userId = req.user?.id as string
      const email = req.user?.email as string
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data:{
              currency: "vnd",
              product_data:{
                name: "Movie ticket",
                description: `Booking Id: ${bookingId}`
              },
              unit_amount: amountIncents
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: bookingId,
          userId: userId,
          seatIds: JSON.stringify(seatIds),
          userEmail: email
        },
        mode: 'payment',
        success_url: `http://localhost:5173/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      }); 
      res.locals.redirectUrl = session.url
      return next()
    } catch (error) {
      next(error)
    }
}

export const checkoutPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpointSecret = 'whsec_fc9c04f7312c8b6ed5e9de0fea355cb82fcc475bfcb519d6ffa5f20c4aedcfc6'
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
              session?.seatIds as string,
              session?.userEmail as string)
        }

        res.status(200).end();
    } catch(error) {
        next(error)
    }
}