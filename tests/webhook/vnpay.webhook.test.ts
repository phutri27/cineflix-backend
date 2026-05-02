import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../src/service/vnpay.service.js", () => ({
  vnpay: {
    verifyIpnCall: vi.fn(),
  },
}));

vi.mock("../../src/dao/transaction.dao.js", () => ({
  transactionObj: {
    updateTransactionStatus: vi.fn(),
    getTransactionInfo: vi.fn(),
    updateTransactionSuccess: vi.fn(),
  },
}));

vi.mock("../../src/dao/ticket.dao.js", () => ({
  ticketObj: {
    createTicket: vi.fn(),
    getTicketInfo: vi.fn(),
  },
}));

vi.mock("../../src/dao/profile.dao.js", () => ({
  profileObj: {
    updateProfileSpending: vi.fn(),
  },
}));

vi.mock("../../src/service/email-queue.service.js", () => ({
  queueTicketEmail: vi.fn(),
}));

import { vnpay } from "../../src/service/vnpay.service.js";
import { transactionObj } from "../../src/dao/transaction.dao.js";
import { ticketObj } from "../../src/dao/ticket.dao.js";
import { profileObj } from "../../src/dao/profile.dao.js";
import { queueTicketEmail } from "../../src/service/email-queue.service.js";

import { ipnUrlProccess } from "../../src/controller/vnpay.controller.js";

describe("ipnUrlProccess VNPay webhook", () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();

    app.get(
      "/webhook/vnpay-ipn",
      ipnUrlProccess,
      (req: Request, res: Response) => {
        return res.status(200).json({
          showTimeId: res.locals.showTimeId,
          userId: res.locals.userId,
          transactionId: res.locals.transactionId,
          IpnSuccess: res.locals.IpnSuccess,
          bookingId: res.locals.bookingId,
        });
      }
    );
  });

  it("should return 400 and update transaction FAILED when checksum is invalid", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: false,
      isSuccess: false,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    vi.mocked(transactionObj.updateTransactionStatus).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(400);

    expect(transactionObj.updateTransactionStatus).toHaveBeenCalledWith(
      "transaction_123",
      "FAILED"
    );

    expect(transactionObj.getTransactionInfo).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should return 400 and update transaction CANCELLED when payment is not successful", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: false,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    vi.mocked(transactionObj.updateTransactionStatus).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(400);

    expect(transactionObj.updateTransactionStatus).toHaveBeenCalledWith(
      "transaction_123",
      "CANCELLED"
    );

    expect(transactionObj.getTransactionInfo).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should return 400 when transaction order is not found", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: true,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue(null as any);

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(400);

    expect(transactionObj.getTransactionInfo).toHaveBeenCalledWith(
      "transaction_123"
    );

    expect(transactionObj.updateTransactionStatus).not.toHaveBeenCalled();
    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should return 400 when transaction id does not match VNPay transaction reference", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: true,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "different_transaction_id",
      status: "PENDING",
      amount: {
        toNumber: () => 150000,
      },
    } as any);

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(400);

    expect(transactionObj.getTransactionInfo).toHaveBeenCalledWith(
      "transaction_123"
    );

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
  });

  it("should return 400 when transaction is already CANCELLED", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: true,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "CANCELLED",
      amount: {
        toNumber: () => 150000,
      },
    } as any);

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(400);

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
    expect(transactionObj.updateTransactionSuccess).not.toHaveBeenCalled();
  });

  it("should return 400 and update transaction FAILED when amount is invalid", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: true,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 100000,
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "PENDING",
      amount: {
        toNumber: () => 150000,
      },
    } as any);

    vi.mocked(transactionObj.updateTransactionStatus).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(400);

    expect(transactionObj.updateTransactionStatus).toHaveBeenCalledWith(
      "transaction_123",
      "FAILED"
    );

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
    expect(transactionObj.updateTransactionSuccess).not.toHaveBeenCalled();
  });

  it("should return 200 when transaction is already SUCCESS", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: true,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue({
      id: "transaction_123",
      status: "SUCCESS",
      amount: {
        toNumber: () => 150000,
      },
    } as any);

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(200);

    expect(ticketObj.createTicket).not.toHaveBeenCalled();
    expect(queueTicketEmail).not.toHaveBeenCalled();
    expect(transactionObj.updateTransactionSuccess).not.toHaveBeenCalled();
  });

  it("should create ticket, send email, update transaction success, update profile spending, and call next when payment is valid", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockReturnValue({
      isVerified: true,
      isSuccess: true,
      vnp_TxnRef: "transaction_123",
      vnp_Amount: 150000,
    } as any);

    const fakeTransactionData = {
      id: "transaction_123",
      bookingId: "booking_123",
      status: "PENDING",
      amount: {
        toNumber: () => 150000,
      },
      booking: {
        showtimeId: "showtime_123",
        user: {
          id: "user_123",
          email: "test@example.com",
        },
        seats: [
          {
            id: "seat_1",
          },
          {
            id: "seat_2",
          },
        ],
      },
    };

    vi.mocked(transactionObj.getTransactionInfo).mockResolvedValue(
      fakeTransactionData as any
    );

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

    vi.mocked(queueTicketEmail).mockResolvedValue(undefined as any);

    vi.mocked(transactionObj.updateTransactionSuccess).mockResolvedValue(
      undefined as any
    );

    vi.mocked(profileObj.updateProfileSpending).mockResolvedValue(
      undefined as any
    );

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
        vnp_Amount: "150000",
      });

    expect(response.status).toBe(200);

    expect(transactionObj.getTransactionInfo).toHaveBeenCalledWith(
      "transaction_123"
    );

    expect(ticketObj.createTicket).toHaveBeenCalledWith(
      ["seat_1", "seat_2"],
      "booking_123"
    );

    expect(ticketObj.getTicketInfo).toHaveBeenCalledWith("booking_123");

    expect(queueTicketEmail).toHaveBeenCalledWith(
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
      'user_123'
    );

    expect(response.body).toEqual({
      showTimeId: "showtime_123",
      userId: "user_123",
      transactionId: "transaction_123",
      IpnSuccess: expect.anything(),
      bookingId: "booking_123",
    });
  });

  it("should return 500 when an unexpected error occurs", async () => {
    vi.mocked(vnpay.verifyIpnCall).mockImplementation(() => {
      throw new Error("VNPay verify error");
    });

    const response = await request(app)
      .get("/webhook/vnpay-ipn")
      .query({
        vnp_TxnRef: "transaction_123",
      });

    expect(response.status).toBe(500);
  });
});