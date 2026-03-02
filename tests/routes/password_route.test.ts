import app from "../root.js";
import { describe, expect, test, beforeAll, afterAll, vi } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";
import { OTPobj } from "../../src/redis-query/otp-query.js";
import { signupObj } from "../../src/redis-query/signup-query.js";
import { redisClient } from "../../src/lib/redis.js";

const signupForm = {
    email: 'test1@gmail.com',
    pw: "Testsignup1.",
    confirmPw: "Testsignup1.",
    first_name: "John",
    last_name: "Smith"
}

vi.mock("../../src/service/generteOTP.js", () => ({
    generateOTP: vi.fn().mockReturnValue("123456")
}))


beforeAll( async () => {
    await request(app)
        .post("/api/signup")
        .type("form")
        .send(signupForm)
        .set('Accept', 'application/json')
})

afterAll(async () => {
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()
    await signupObj.deleteSignupInfo('test1@gmail.com')
    await OTPobj.deleteOTP('test1@gmail.com')
})

test("forgot password functionality", async () => {
    const response = await request(app)
        .post("/api/password/forgot")
        .type("form")
        .send({email: "test1@gmail.com"})
        .set('Accept', 'application/json')
    
    console.log(response.body)
    expect(response.status).toBe(200)

})