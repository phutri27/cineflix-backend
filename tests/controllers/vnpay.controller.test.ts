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

vi.mock("../../src/redis-query/payment-query.js", () => ({
  paymentObj: {
    setCheckoutSession: vi.fn(),
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

vi.mock("vnpay", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vnpay")>();

  return {
    ...actual,
    dateFormat: vi.fn(() => "20260101120000"),
  };
});

vi.mock("../../src/service/vnpay.service.js", () => ({
  vnpay: {
    buildPaymentUrl: vi.fn(),
  },
}));

import { ticketObj } from "../../src/dao/ticket.dao.js";
import { transactionObj } from "../../src/dao/transaction.dao.js";
import { bookingObj } from "../../src/dao/booking.dao.js";
import { paymentObj } from "../../src/redis-query/payment-query.js";
import { v4 as uuidv4 } from "uuid";
import { vnpay } from "../../src/service/vnpay.service.js";
import { dateFormat } from "vnpay";

import { vnpayCheckout } from "../../src/controller/vnpay.controller.js"

describe("vnpayCheckout", () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());

    app.post(
      "/vnpay-checkout",
      (req: Request, res: Response, next: NextFunction) => {
        (req as any).user = {
          id: "user_123",
          email: "test@example.com",
        };

        res.locals.amount = 150000;
        next();
      },
      vnpayCheckout,
      (req: Request, res: Response) => {
        return res.status(200).json({
          bookingId: res.locals.bookingId,
          vnpayPaymentUrl: res.locals.vnpayPaymentUrl,
        });
      }
    );

    app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({
          message: err.message,
        });
      }
    );
  });

  it("should create VNPay payment URL and create new booking when bookingId does not exist", async () => {
    vi.mocked(uuidv4)
      .mockReturnValueOnce("transaction_123")
      .mockReturnValueOnce("booking_123");

    vi.mocked(vnpay.buildPaymentUrl).mockReturnValue(
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_SecureHash=session_123"
    );

    vi.mocked(paymentObj.setCheckoutSession).mockResolvedValue(undefined as any);
    vi.mocked(transactionObj.createTransactionAndBooking).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .post("/vnpay-checkout")
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
      bookingId: "booking_123",
      vnpayPaymentUrl:
        "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_SecureHash=session_123",
    });

    expect(vnpay.buildPaymentUrl).toHaveBeenCalled();

    expect(paymentObj.setCheckoutSession).toHaveBeenCalledWith(
      "session_123",
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
        provider: "vnpay",
        providerTransactionId: "session_123",
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

    vi.mocked(vnpay.buildPaymentUrl).mockReturnValue(
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_SecureHash=session_456"
    );

    vi.mocked(paymentObj.setCheckoutSession).mockResolvedValue(undefined as any);
    vi.mocked(transactionObj.createTransaction).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .post("/vnpay-checkout")
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
      bookingId: "existing_booking_123",
      vnpayPaymentUrl:
        "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_SecureHash=session_456",
    });

    expect(ticketObj.getPaidTicket).toHaveBeenCalledWith(
      "existing_booking_123"
    );

    expect(transactionObj.getTransactionMethod).toHaveBeenCalledWith(
      "vnpay",
      "existing_booking_123"
    );

    expect(bookingObj.getBookingStatus).toHaveBeenCalledWith(
      "existing_booking_123"
    );

    expect(paymentObj.setCheckoutSession).toHaveBeenCalledWith(
      "session_456",
      "user_123"
    );

    expect(transactionObj.createTransaction).toHaveBeenCalledWith({
      id: "transaction_456",
      bookingId: "existing_booking_123",
      provider: "vnpay",
      providerTransactionId: "session_456",
      amount: 150000,
    });

    expect(transactionObj.createTransactionAndBooking).not.toHaveBeenCalled();
  });

  it("should return 400 when seat is already taken", async () => {
    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(1 as any);

    const response = await request(app)
      .post("/vnpay-checkout")
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
    expect(vnpay.buildPaymentUrl).not.toHaveBeenCalled();
  });

  it("should return 400 when VNPay transaction method was already picked", async () => {
    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(0 as any);
    vi.mocked(transactionObj.getTransactionMethod).mockResolvedValue(1 as any);

    const response = await request(app)
      .post("/vnpay-checkout")
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

    expect(transactionObj.getTransactionMethod).toHaveBeenCalledWith(
      "vnpay",
      "booking_123"
    );

    expect(bookingObj.getBookingStatus).not.toHaveBeenCalled();
    expect(vnpay.buildPaymentUrl).not.toHaveBeenCalled();
  });

  it("should return 400 when booking status is not PENDING", async () => {
    vi.mocked(ticketObj.getPaidTicket).mockResolvedValue(0 as any);
    vi.mocked(transactionObj.getTransactionMethod).mockResolvedValue(0 as any);
    vi.mocked(bookingObj.getBookingStatus).mockResolvedValue({
      status: "EXPIRED",
    } as any);

    const response = await request(app)
      .post("/vnpay-checkout")
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
    expect(vnpay.buildPaymentUrl).not.toHaveBeenCalled();
  });

  it("should pass error to error handler when VNPay buildPaymentUrl throws error", async () => {
    vi.mocked(uuidv4)
      .mockReturnValueOnce("transaction_123")
      .mockReturnValueOnce("booking_123");

    vi.mocked(vnpay.buildPaymentUrl).mockImplementation(() => {
      throw new Error("VNPay error");
    });

    const response = await request(app)
      .post("/vnpay-checkout")
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
      message: "VNPay error",
    });

    expect(dateFormat).toHaveBeenCalled();

    expect(vnpay.buildPaymentUrl).toHaveBeenCalledWith(
    expect.objectContaining({
        vnp_ExpireDate: "20260101120000",
    })
    );
  });
});