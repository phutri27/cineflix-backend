import request from "supertest";
import express, { Request, Response } from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../src/config/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    checkout: {
      sessions: {
        retrieve: vi.fn(),
        expire: vi.fn(),
      },
    },
  },
}));

vi.mock("../../src/redis-query/payment-query", () => ({
  paymentObj: {
    setPaymentSession: vi.fn(),
  },
}));

vi.mock("../../src/dao/booking.dao", () => ({
  bookingObj: {
    getBookingStatus: vi.fn(),
    getBookingSeats: vi.fn(),
  },
}));

vi.mock("../../src/dao/ticket.dao", () => ({
  ticketObj: {
    createTicket: vi.fn(),
    getTicketInfo: vi.fn(),
  },
}));

vi.mock("../../src/dao/transaction.dao", () => ({
  transactionObj: {
    getTransactionInfo: vi.fn(),
    updateTransactionSuccess: vi.fn(),
  },
}));

vi.mock("../../src/dao/profile.dao", () => ({
  profileObj: {
    updateProfileSpending: vi.fn(),
  },
}));

vi.mock("../../src/service/ticket-mail.service", () => ({
  sendTicket: vi.fn(),
}));

import { stripe } from "../../src/config/stripe";
import { paymentObj } from "../../src/redis-query/payment-query";
import { bookingObj } from "../../src/dao/booking.dao";
import { ticketObj } from "../../src/dao/ticket.dao";
import { transactionObj } from "../../src/dao/transaction.dao";
import { profileObj } from "../../src/dao/profile.dao";
import { sendTicket } from "../../src/service/ticket-mail.service";

import { checkoutPost } from "../../src/controller/stripe.controller";
import { fulfillCheckout } from "../../src/service/stripe.service";

describe("Stripe webhook checkoutPost", () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.STRIPE_ENDPOINT_SECRET = "whsec_test";

    app = express();
    
    app.post(
      "/webhook/stripe",
      express.raw({ type: "application/json" }),
      checkoutPost,
      (req: Request, res: Response) => {
        return res.status(200).json({
          showTimeId: res.locals.showTimeId,
          transactionId: res.locals.transactionId,
          userId: res.locals.userId,
          bookingId: res.locals.bookingId,
        });
      }
    );

    app.use((err: Error, req: Request, res: Response) => {
      return res.status(500).json({
        message: err.message,
      });
    });
  });

  it("should return 400 when Stripe signature verification fails", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const response = await request(app)
      .post("/webhook/stripe")
      .set("stripe-signature", "invalid_signature")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));

    expect(response.status).toBe(400);

    expect(response.body).toBe("Webhook Error: Invalid signature");

    expect(paymentObj.setPaymentSession).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should return 200 and do nothing for unsupported event type", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "payment_intent.succeeded",
      data: {
        object: {},
      },
    } as any);

    const response = await request(app)
      .post("/webhook/stripe")
      .set("stripe-signature", "valid_signature")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));

    expect(response.status).toBe(200);

    expect(paymentObj.setPaymentSession).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
    expect(transactionObj.updateTransactionSuccess).not.toHaveBeenCalled();
  });

  it("should fulfill checkout when checkout.session.completed event is valid", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          metadata: {
            bookingId: "booking_123",
            userId: "user_123",
            userEmail: "test@example.com",
            transactionId: "transaction_123",
            totalAmount: "150000",
            showTimeId: "showtime_123",
          },
        },
      },
    } as any);

    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: "cs_test_123",
      status: "complete",
      payment_status: "paid",
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "PENDING",
    } as any);

    vi.mocked(bookingObj.getBookingSeats).mockResolvedValue({
      seats: [
        {
          id: "seat_1",
        },
        {
          id: "seat_2",
        },
      ],
    } as any);

    vi.mocked(ticketObj.createTicket).mockResolvedValue(undefined as any);

    vi.mocked(ticketObj.getTicketInfo).mockResolvedValue([
      {
        id: "ticket_1",
        seat: "A1",
      },
      {
        id: "ticket_2",
        seat: "A2",
      },
    ] as any);

    vi.mocked(sendTicket).mockResolvedValue(undefined as any);
    vi.mocked(transactionObj.updateTransactionSuccess).mockResolvedValue(undefined as any);
    vi.mocked(profileObj.updateProfileSpending).mockResolvedValue(undefined as any);

    const response = await request(app)
      .post("/webhook/stripe")
      .set("stripe-signature", "valid_signature")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));

    expect(response.status).toBe(200);

    expect(paymentObj.setPaymentSession).toHaveBeenCalledWith(
      "cs_test_123",
      "user_123"
    );

    expect(bookingObj.getBookingStatus).toHaveBeenCalledWith("booking_123");

    expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
      "cs_test_123",
      {
        expand: ["line_items"],
      }
    );

    expect(transactionObj.getTransactionInfo).toHaveBeenCalledWith(
      "transaction_123"
    );

    expect(bookingObj.getBookingSeats).toHaveBeenCalledWith("booking_123");

    expect(ticketObj.createTicket).toHaveBeenCalledWith(
      ["seat_1", "seat_2"],
      "booking_123"
    );

    expect(ticketObj.getTicketInfo).toHaveBeenCalledWith("booking_123");

    expect(sendTicket).toHaveBeenCalledWith(
      "test@example.com",
      [
        {
          id: "ticket_1",
          seat: "A1",
        },
        {
          id: "ticket_2",
          seat: "A2",
        },
      ],
      "booking_123"
    );

    expect(transactionObj.updateTransactionSuccess).toHaveBeenCalledWith(
      "transaction_123",
      "booking_123"
    );

    expect(profileObj.updateProfileSpending).toHaveBeenCalledWith(
      150000,
      "user_123"
    );

    expect(response.body).toEqual({
      showTimeId: "showtime_123",
      transactionId: "transaction_123",
      userId: "user_123",
      bookingId: "booking_123",
    });
  });

  it("should also fulfill checkout for checkout.session.async_payment_succeeded", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.async_payment_succeeded",
      data: {
        object: {
          id: "cs_test_async_123",
          metadata: {
            bookingId: "booking_123",
            userId: "user_123",
            userEmail: "test@example.com",
            transactionId: "transaction_123",
            totalAmount: "150000",
            showTimeId: "showtime_123",
          },
        },
      },
    } as any);

    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: "cs_test_async_123",
      status: "complete",
      payment_status: "paid",
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "PENDING",
    } as any);

    vi.mocked(bookingObj.getBookingSeats).mockResolvedValue({
      seats: [
        {
          id: "seat_1",
        },
      ],
    } as any);

    vi.mocked(ticketObj.getTicketInfo).mockResolvedValue([] as any);

    const response = await request(app)
      .post("/webhook/stripe")
      .set("stripe-signature", "valid_signature")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));

    expect(response.status).toBe(200);

    expect(paymentObj.setPaymentSession).toHaveBeenCalledWith(
      "cs_test_async_123",
      "user_123"
    );

    expect(ticketObj.createTicket).toHaveBeenCalledWith(
      ["seat_1"],
      "booking_123"
    );
  });

  it("should call next but not fulfill if metadata is missing", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          metadata: {
            bookingId: "booking_123",
          },
        },
      },
    } as any);

    const response = await request(app)
      .post("/webhook/stripe")
      .set("stripe-signature", "valid_signature")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));

    expect(response.status).toBe(200);

    expect(paymentObj.setPaymentSession).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();

    expect(response.body).toEqual({});
  });

  it("should pass unexpected errors to error handler", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          metadata: {
            bookingId: "booking_123",
            userId: "user_123",
            userEmail: "test@example.com",
            transactionId: "transaction_123",
            totalAmount: "150000",
            showTimeId: "showtime_123",
          },
        },
      },
    } as any);

    vi.mocked(paymentObj.setPaymentSession).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app)
      .post("/webhook/stripe")
      .set("stripe-signature", "valid_signature")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));

    expect(response.status).toBe(500);

  });
});

describe("fulfillCheckout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should stop if setPaymentSession returns false", async () => {
    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(false as any);

    await fulfillCheckout(
      "cs_test_123",
      "booking_123",
      "user_123",
      "test@example.com",
      "transaction_123",
      150000
    );

    expect(paymentObj.setPaymentSession).toHaveBeenCalledWith(
      "cs_test_123",
      "user_123"
    );

    expect(bookingObj.getBookingStatus).not.toHaveBeenCalled();
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should stop if booking is already PAID", async () => {
    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PAID",
    } as any);

    await fulfillCheckout(
      "cs_test_123",
      "booking_123",
      "user_123",
      "test@example.com",
      "transaction_123",
      150000
    );

    expect(bookingObj.getBookingStatus).toHaveBeenCalledWith("booking_123");
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should stop if transaction is already SUCCESS", async () => {
    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: "cs_test_123",
      status: "complete",
      payment_status: "paid",
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "SUCCESS",
    } as any);

    await fulfillCheckout(
      "cs_test_123",
      "booking_123",
      "user_123",
      "test@example.com",
      "transaction_123",
      150000
    );

    expect(transactionObj.getTransactionInfo).toHaveBeenCalledWith(
      "transaction_123"
    );

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
    expect(sendTicket).not.toHaveBeenCalled();
    expect(transactionObj.updateTransactionSuccess).not.toHaveBeenCalled();
  });

  it("should expire Stripe session if transaction is CANCELLED and checkout session is open", async () => {
    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: "cs_test_123",
      status: "open",
      payment_status: "unpaid",
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "CANCELLED",
    } as any);

    vi.mocked(stripe.checkout.sessions.expire).mockResolvedValue({} as any);

    await fulfillCheckout(
      "cs_test_123",
      "booking_123",
      "user_123",
      "test@example.com",
      "transaction_123",
      150000
    );

    expect(stripe.checkout.sessions.expire).toHaveBeenCalledWith(
      "cs_test_123"
    );

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should not create ticket when payment_status is unpaid", async () => {
    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: "cs_test_123",
      status: "complete",
      payment_status: "unpaid",
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "PENDING",
    } as any);

    await fulfillCheckout(
      "cs_test_123",
      "booking_123",
      "user_123",
      "test@example.com",
      "transaction_123",
      150000
    );

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
    expect(sendTicket).not.toHaveBeenCalled();
    expect(transactionObj.updateTransactionSuccess).not.toHaveBeenCalled();
  });

  it("should create ticket and update transaction when payment_status is paid", async () => {
    vi.mocked(paymentObj.setPaymentSession).mockResolvedValue(true as any);

    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: "cs_test_123",
      status: "complete",
      payment_status: "paid",
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "PENDING",
    } as any);

    vi.mocked(bookingObj.getBookingSeats).mockResolvedValue({
      seats: [
        {
          id: "seat_1",
        },
        {
          id: "seat_2",
        },
      ],
    } as any);

    vi.mocked(ticketObj.getTicketInfo).mockResolvedValue([
      {
        id: "ticket_1",
      },
    ] as any);

    await fulfillCheckout(
      "cs_test_123",
      "booking_123",
      "user_123",
      "test@example.com",
      "transaction_123",
      150000
    );

    expect(ticketObj.createTicket).toHaveBeenCalledWith(
      ["seat_1", "seat_2"],
      "booking_123"
    );

    expect(sendTicket).toHaveBeenCalledWith(
      "test@example.com",
      [
        {
          id: "ticket_1",
        },
      ],
      "booking_123"
    );

    expect(transactionObj.updateTransactionSuccess).toHaveBeenCalledWith(
      "transaction_123",
      "booking_123"
    );

    expect(profileObj.updateProfileSpending).toHaveBeenCalledWith(
      150000,
      "user_123"
    );
  });
});