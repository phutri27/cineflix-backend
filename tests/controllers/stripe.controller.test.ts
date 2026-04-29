import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";
vi.mock("../../src/dao/ticket.dao.js", () => ({
  ticketObj: {
    getPaidTicket: vi.fn(),
  },
}));

vi.mock("../../src/dao/transaction.dao.js", () => ({
  transactionObj: {
    getTransactionMethod: vi.fn(),
    createTransaction: vi.fn(),
    createTransactionAndBooking: vi.fn(),
  },
}));

vi.mock("../../src/dao/booking.dao.js", () => ({
  bookingObj: {
    getBookingStatus: vi.fn(),
  },
}));

vi.mock("../../src/dao/movies.dao.js", () => ({
  moviesObj: {
    getSpecificMovie: vi.fn(),
  },
}));

vi.mock("../../src/redis-query/payment-query.js", () => ({
  paymentObj: {
    setCheckoutSession: vi.fn(),
  },
}));

vi.mock("../../src/config/stripe.js", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

import { ticketObj } from "../../src/dao/ticket.dao.js";
import { transactionObj } from "../../src/dao/transaction.dao.js";
import { bookingObj } from "../../src/dao/booking.dao.js";
import { moviesObj } from "../../src/dao/movies.dao.js";
import { paymentObj } from "../../src/redis-query/payment-query.js";
import { stripe } from "../../src/config/stripe.js";
import { v4 as uuidv4 } from "uuid";
import { checkoutSession } from "../../src/controller/stripe.controller.js";


describe("checkoutSession", () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());

    app.post(
      "/checkout",
      (req: Request, res: Response, next: NextFunction) => {
        (req as any).user = {
          id: "user_123",
          email: "test@example.com",
        };

        res.locals.amount = 150000;
        next();
      },
      checkoutSession,
      (req: Request, res: Response) => {
        return res.status(200).json({
          redirectUrl: res.locals.redirectUrl,
          bookingId: res.locals.bookingId,
        });
      }
    );
  });

  it("should create Stripe checkout session and create new booking when bookingId does not exist", async () => {
    vi.mocked(uuidv4)
      .mockReturnValueOnce("booking_123")
      .mockReturnValueOnce("transaction_123");

    vi.mocked(moviesObj.getSpecificMovie).mockResolvedValue({
      title: "Avengers",
    } as any);

    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      id: "cs_test_123",
      url: "https://stripe.com/checkout/cs_test_123",
    } as any);

    vi.mocked(paymentObj.setCheckoutSession).mockResolvedValue(undefined as any);
    vi.mocked(transactionObj.createTransactionAndBooking).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .post("/checkout")
      .send({
        datas: {
          movieId: "movie_123",
          showtimeId: "showtime_123",
          seats: ["A1", "A2"],
          snacks: [],
          vouchers: [],
        },
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      redirectUrl: "https://stripe.com/checkout/cs_test_123",
      bookingId: "booking_123",
    });

    expect(moviesObj.getSpecificMovie).toHaveBeenCalledWith("movie_123");

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
      customer_email: "test@example.com",
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              name: "Avengers's ticket",
              description: "Booking id: booking_123",
            },
            unit_amount: 150000,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: "booking_123",
        userId: "user_123",
        userEmail: "test@example.com",
        showTimeId: "showtime_123",
        transactionId: "transaction_123",
        totalAmount: 150000,
      },
      mode: "payment",
      success_url:
        "http://localhost:5173/payment/complete?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "http://localhost:5173/payment/cancel?session_id={CHECKOUT_SESSION_ID}",
    });

    expect(paymentObj.setCheckoutSession).toHaveBeenCalledWith(
      "cs_test_123",
      "user_123"
    );

    expect(transactionObj.createTransactionAndBooking).toHaveBeenCalledWith(
      {
        id: "booking_123",
        seats: ["A1", "A2"],
        showtimeId: "showtime_123",
        snacks: [],
        vouchers: [],
      },
      {
        id: "transaction_123",
        bookingId: "booking_123",
        provider: "Stripe",
        providerTransactionId: "cs_test_123",
        amount: 150000,
      },
      "user_123"
    );

    expect(transactionObj.createTransaction).not.toHaveBeenCalled();
  });

  it("should create transaction only when bookingId already exists and booking is PENDING", async () => {
    vi.mocked(uuidv4).mockReturnValueOnce("transaction_456");

    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(0 as any);
    vi.mocked(transactionObj.getTransactionMethod).mockResolvedValue(0 as any);
    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "PENDING",
    } as any);

    vi.mocked(moviesObj.getSpecificMovie).mockResolvedValue({
      title: "Batman",
    } as any);

    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      id: "cs_test_456",
      url: "https://stripe.com/checkout/cs_test_456",
    } as any);

    vi.mocked(paymentObj.setCheckoutSession).mockResolvedValue(undefined as any);
    vi.mocked(transactionObj.createTransaction).mockResolvedValue(undefined as any);

    const response = await request(app)
      .post("/checkout")
      .send({
        datas: {
          bookingId: "existing_booking_123",
          movieId: "movie_456",
          showtimeId: "showtime_456",
          seats: ["B1"],
          snacks: [],
          vouchers: [],
        },
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      redirectUrl: "https://stripe.com/checkout/cs_test_456",
      bookingId: "existing_booking_123",
    });

    expect(ticketObj.getPaidTicket).toHaveBeenCalledWith(
      "existing_booking_123"
    );

    expect(transactionObj.getTransactionMethod).toHaveBeenCalledWith(
      "Stripe",
      "existing_booking_123"
    );

    expect(bookingObj.getBookingStatus).toHaveBeenCalledWith(
      "existing_booking_123"
    );

    expect(transactionObj.createTransaction).toHaveBeenCalledWith({
      id: "transaction_456",
      bookingId: "existing_booking_123",
      provider: "Stripe",
      providerTransactionId: "cs_test_456",
      amount: 150000,
    });

    expect(transactionObj.createTransactionAndBooking).not.toHaveBeenCalled();
  });

  it("should return 400 when seat is already taken", async () => {
    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(1 as any);

    const response = await request(app)
      .post("/checkout")
      .send({
        datas: {
          bookingId: "booking_123",
          movieId: "movie_123",
          showtimeId: "showtime_123",
          seats: ["A1"],
          snacks: [],
          vouchers: [],
        },
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      seatTaken: true,
    });

    expect(ticketObj.getPaidTicket).toHaveBeenCalledWith("booking_123");
    expect(transactionObj.getTransactionMethod).not.toHaveBeenCalled();
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("should return 400 when Stripe transaction method was already picked", async () => {
    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(0 as any);
    vi.mocked(transactionObj.getTransactionMethod).mockResolvedValue(1 as any);

    const response = await request(app)
      .post("/checkout")
      .send({
        datas: {
          bookingId: "booking_123",
          movieId: "movie_123",
          showtimeId: "showtime_123",
          seats: ["A1"],
          snacks: [],
          vouchers: [],
        },
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      transactionMethodPicked: true,
    });

    expect(ticketObj.getPaidTicket).toHaveBeenCalledWith("booking_123");

    expect(transactionObj.getTransactionMethod).toHaveBeenCalledWith(
      "Stripe",
      "booking_123"
    );

    expect(bookingObj.getBookingStatus).not.toHaveBeenCalled();
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("should return 400 when booking is not PENDING", async () => {
    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(0 as any);
    vi.mocked(transactionObj.getTransactionMethod).mockResolvedValue(0 as any);
    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "EXPIRED",
    } as any);

    const response = await request(app)
      .post("/checkout")
      .send({
        datas: {
          bookingId: "booking_123",
          movieId: "movie_123",
          showtimeId: "showtime_123",
          seats: ["A1"],
          snacks: [],
          vouchers: [],
        },
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      bookingExpire: true,
    });

    expect(bookingObj.getBookingStatus).toHaveBeenCalledWith("booking_123");
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("should pass error to error handler when Stripe throws error", async () => {
    vi.mocked(uuidv4)
      .mockReturnValueOnce("booking_123")
      .mockReturnValueOnce("transaction_123");

    vi.mocked(moviesObj.getSpecificMovie).mockResolvedValue({
      title: "Avengers",
    } as any);

    vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
      new Error("Stripe error")
    );

    const errorApp = express();
    errorApp.use(express.json());

    errorApp.post(
      "/checkout",
      (req: Request, res: Response, next: NextFunction) => {
        (req as any).user = {
          id: "user_123",
          email: "test@example.com",
        };

        res.locals.amount = 150000;
        next();
      },
      checkoutSession
    );

    errorApp.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({
          message: err.message,
        });
      }
    );

    const response = await request(errorApp)
      .post("/checkout")
      .send({
        datas: {
          movieId: "movie_123",
          showtimeId: "showtime_123",
          seats: ["A1"],
          snacks: [],
          vouchers: [],
        },
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      message: "Stripe error",
    });
  });
});