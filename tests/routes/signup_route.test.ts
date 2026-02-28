import app from "../root.js";
import { describe, expect, test, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";

beforeAll(async () => {
    await prisma.user.deleteMany({})
});

afterAll(async () => {
    await prisma.user.deleteMany({})
})

describe("test signup route", () => {
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
        expect(response.body.message).toBe("Create account succesfully")
    })

    test("test login success", async () => {
        const response = await request(app)
            .post("/api/login")
            .type("form")
            .send({email: "test1@gmail.com", pw: "Testsignup1."})
            .set('Accept', 'application/json')
            
        expect(response.status).toBe(200)
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