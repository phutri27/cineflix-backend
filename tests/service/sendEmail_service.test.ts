import app from "../root.js";
import {describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import request from "supertest"
import nodemailer from 'nodemailer'
import { OTPobj } from "../../src/redis-query/otp-query.js";
import { generateOTP } from "../../src/service/generteOTP.js";
import { sendEmail } from "../../src/service/mail.js";

vi.mock("../../src/redis-query/otp-query", () =>({
    OTPobj:{
        saveOTP: vi.fn()
    }
}))

vi.mock("../../src/service/generteOTP.js", () => ({
    generateOTP: vi.fn()
}))

const mockSendMail = vi.fn();
vi.mock('nodemailer', () => ({
    default: {
        createTestAccount: vi.fn(),
        createTransport: vi.fn().mockImplementation(() => ({
            sendMail: mockSendMail 
        })),
        getTestMessageUrl: vi.fn()
    }
}));

describe('sendEmail Function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should successfully generate an OTP, send an email, and save to Redis', async () => {
        vi.mocked(generateOTP).mockReturnValue('123456');

        const mockAccount = {
            smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
            user: 'fake_user@ethereal.email',
            pass: 'fake_pass'
        };
        vi.mocked(nodemailer.createTestAccount).mockResolvedValue(mockAccount as any);

        mockSendMail.mockResolvedValue({ messageId: 'mock-id-999' });

        vi.mocked(nodemailer.getTestMessageUrl).mockReturnValue('http://fake-ethereal-url.com');

        vi.mocked(OTPobj.saveOTP).mockResolvedValue(undefined);

        await sendEmail('john@gmail.com', 'user-uuid-123');

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: mockAccount.smtp.host,
            port: mockAccount.smtp.port,
            secure: mockAccount.smtp.secure,
            auth: {
                user: mockAccount.user,
                pass: mockAccount.pass,
            }
        });

        expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
            to: 'john@gmail.com',
            subject: 'Changing password OTP',
            html: expect.stringContaining('123456') 
        }));

        expect(OTPobj.saveOTP).toHaveBeenCalledWith('123456', 'user-uuid-123');
        expect(OTPobj.saveOTP).toHaveBeenCalledTimes(1);
    });
});