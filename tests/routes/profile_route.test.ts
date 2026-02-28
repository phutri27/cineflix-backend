import app from "../root.js";
import { expect, test, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";
import { profileObj } from "../../src/dao/profile.dao.js";
import { userObj } from "../../src/dao/user.dao.js";
import { genPassword } from "../../src/utils/password.util.js";
import { redisClient } from "../../src/lib/redis.js";
import { createMockBookingData } from "../test_util/mockData.js";


let user: any;
const agent = request.agent(app)

beforeAll(async () => {
    const hashed_password  = await genPassword("Testprj1.") as string
    user = await userObj.createUser("test5@gmail.com", hashed_password, "John", "Smith") 
    await agent
        .post("/api/login")
        .type("form")
        .send({email: "test5@gmail.com", pw: "Testprj1."})
        .set('Accept', 'application/json')
})

afterAll(async () => {
    // for await (const key of redisClient.sScanIterator('sess', {MATCH: "*"})){
    //     console.log(key)
    //     await redisClient.del(key)
    // }
    await prisma.user.deleteMany()
    await prisma.profile.deleteMany()
})

test("test edit profile route", async () => {
    const response = await agent
        .put("/api/customer/profile/edit")
        .type("form")
        .send({first_name: "linh", last_name: "huong"})
        .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Success")
})
