import app from "../root.js";
import { describe, expect, test, beforeAll, afterAll, vi } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";
import { OTPobj } from "../../src/redis-query/otp-query.js";
import { signupObj } from "../../src/redis-query/signup-query.js";
import { redisClient } from "../../src/lib/redis.js";

const pattern = 'sess:*'

vi.mock("../../src/service/generteOTP.js", () => ({
    generateOTP: vi.fn().mockReturnValue("123456")
}))

beforeAll(async () => {
    await prisma.user.deleteMany()
});

afterAll(async () => {
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()
    await OTPobj.deleteOTP('test1@gmail.com')
    await signupObj.deleteSignupInfo('test1@gmail.com')
    for await (const key of redisClient.scanIterator({MATCH: pattern})){
        await redisClient.del(key)
    }
    await redisClient.close()
})

describe("test signup and login route", () => {
    test("test signup post success", async () => {
        const signupForm = {
            email: 'test1@gmail.com',
            pw: "Testsignup1.",
            confirmPw: "Testsignup1.",
            first_name: "John",
            last_name: "Smith"
        }
        const response = await request(app)
            .post("/api/signup")
            .type("form")
            .send(signupForm)
            .set('Accept', 'application/json')

        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.message).toBe("Please check your email, an OTP is need to complete the signup")
    })

    test("test confirm signup OTP success", async () => {
        const response = await request(app)
            .post("/api/signup/otp")
            .type("form")
            .send({otp: '123456', email:"test1@gmail.com"})
            .set('Accept', 'application/json')

        expect(response.status).toBe(200)
    })

    test("test login success", async () => {
        const response = await request(app)
            .post("/api/login")
            .type("form")
            .send({email: "test1@gmail.com", pw: "Testsignup1."})
            .set('Accept', 'application/json')
            
        expect(response.status).toBe(200)
        expect(response.body.message).toMatch("Login successfully")
    })

    test("test signup post fail", async () => {
        const signupForm = {
            email: 'test2@gmail.com',
            pw: "Testsignup1",
            confirmPw: "Testsignup",
            first_name: "",
            last_name: ""
        }
        const response = await request(app)
            .post("/api/signup")
            .type("form")
            .send(signupForm)
            .set('Accept', 'application/json')

        expect(response.status).toBe(400)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors.length).toEqual(4)
    })
})