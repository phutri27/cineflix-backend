import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../src/redis-query/seat-lock-query", () => ({
  seatLockObj: {
    lockSeat: vi.fn(),
    getLockSeatValue: vi.fn(),
  },
}));

import { seatLockObj } from "../../src/redis-query/seat-lock-query";

import { seatLock } from "../../src/controller/seat-lock.controller";

describe("seatLock controller", () => {
  let app: express.Express;
  let ioMock: {
    emit: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());

    ioMock = {
      emit: vi.fn(),
    };

    app.set("socketio", ioMock);
  });

  const requestBody = {
    datas: {
      showtimeId: "showtime_123",
      seats: [
        {
          seat_id: "seat_1",
        },
        {
          seat_id: "seat_2",
        },
      ],
    },
  };

  it("should lock seats and return redirectUrl when Stripe checkout URL exists", async () => {
    vi.mocked(seatLockObj.lockSeat).mockResolvedValue(true as any);
    vi.mocked(seatLockObj.getLockSeatValue).mockResolvedValue(null as any);

    app.post(
      "/seat-lock",
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.bookingId = "booking_123";
        res.locals.redirectUrl = "https://stripe.com/checkout/session_123";
        next();
      },
      seatLock
    );

    const response = await request(app)
      .post("/seat-lock")
      .send(requestBody);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      redirectUrl: "https://stripe.com/checkout/session_123",
      bookingId: "booking_123",
    });

    expect(seatLockObj.lockSeat).toHaveBeenCalledTimes(2);

    expect(seatLockObj.lockSeat).toHaveBeenNthCalledWith(
      1,
      "showtime_123",
      "seat_1",
      "booking_123"
    );

    expect(seatLockObj.lockSeat).toHaveBeenNthCalledWith(
      2,
      "showtime_123",
      "seat_2",
      "booking_123"
    );

    expect(seatLockObj.getLockSeatValue).toHaveBeenCalledTimes(2);

    expect(ioMock.emit).toHaveBeenCalledWith("seats_status", [
      "seat_1",
      "seat_2",
    ]);
  });

  it("should lock seats and return paymentUrl when VNPay payment URL exists", async () => {
    vi.mocked(seatLockObj.lockSeat).mockResolvedValue(true as any);
    vi.mocked(seatLockObj.getLockSeatValue).mockResolvedValue(null as any);

    app.post(
      "/seat-lock",
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.bookingId = "booking_456";
        res.locals.vnpayPaymentUrl =
          "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        next();
      },
      seatLock
    );

    const response = await request(app)
      .post("/seat-lock")
      .send(requestBody);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      bookingId: "booking_456",
    });

    expect(seatLockObj.lockSeat).toHaveBeenCalledTimes(2);

    expect(ioMock.emit).toHaveBeenCalledWith("seats_status", [
      "seat_1",
      "seat_2",
    ]);
  });

  it("should return 400 when seat is already taken by another booking", async () => {
    vi.mocked(seatLockObj.lockSeat).mockResolvedValue(false as any);
    vi.mocked(seatLockObj.getLockSeatValue).mockResolvedValue(
      "another_booking_999" as any
    );

    app.post(
      "/seat-lock",
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.bookingId = "booking_123";
        res.locals.redirectUrl = "https://stripe.com/checkout/session_123";
        next();
      },
      seatLock
    );

    const response = await request(app)
      .post("/seat-lock")
      .send(requestBody);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      seatTaken: true,
    });

    expect(seatLockObj.lockSeat).toHaveBeenCalledWith(
      "showtime_123",
      "seat_1",
      "booking_123"
    );

    expect(seatLockObj.getLockSeatValue).toHaveBeenCalledWith(
      "showtime_123",
      "seat_1"
    );

    expect(ioMock.emit).not.toHaveBeenCalled();
  });

  it("should continue when lockSeat returns false but current booking already owns the lock", async () => {
    vi.mocked(seatLockObj.lockSeat).mockResolvedValue(false as any);
    vi.mocked(seatLockObj.getLockSeatValue).mockResolvedValue(
      "booking_123" as any
    );

    app.post(
      "/seat-lock",
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.bookingId = "booking_123";
        res.locals.redirectUrl = "https://stripe.com/checkout/session_123";
        next();
      },
      seatLock
    );

    const response = await request(app)
      .post("/seat-lock")
      .send(requestBody);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      redirectUrl: "https://stripe.com/checkout/session_123",
      bookingId: "booking_123",
    });

    expect(seatLockObj.lockSeat).toHaveBeenCalledTimes(2);

    expect(ioMock.emit).toHaveBeenCalledWith("seats_status", [
      "seat_1",
      "seat_2",
    ]);
  });

  it("should stop at the first taken seat and not lock remaining seats", async () => {
    vi.mocked(seatLockObj.lockSeat)
      .mockResolvedValueOnce(true as any)
      .mockResolvedValueOnce(false as any);

    vi.mocked(seatLockObj.getLockSeatValue)
      .mockResolvedValueOnce(null as any)
      .mockResolvedValueOnce("another_booking_999" as any);

    app.post(
      "/seat-lock",
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.bookingId = "booking_123";
        res.locals.redirectUrl = "https://stripe.com/checkout/session_123";
        next();
      },
      seatLock
    );

    const response = await request(app)
      .post("/seat-lock")
      .send(requestBody);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      seatTaken: true,
    });

    expect(seatLockObj.lockSeat).toHaveBeenCalledTimes(2);
    expect(ioMock.emit).not.toHaveBeenCalled();
  });

  it("should pass unexpected errors to error handler", async () => {
    vi.mocked(seatLockObj.lockSeat).mockRejectedValue(
      new Error("Redis error")
    );

    app.post(
      "/seat-lock",
      (req: Request, res: Response, next: NextFunction) => {
        res.locals.bookingId = "booking_123";
        res.locals.redirectUrl = "https://stripe.com/checkout/session_123";
        next();
      },
      seatLock
    );

    app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({
          message: err.message,
        });
      }
    );

    const response = await request(app)
      .post("/seat-lock")
      .send(requestBody);

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      message: "Redis error",
    });
  });
});