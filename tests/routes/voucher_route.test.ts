import app from "../root.js";
import { describe, expect, test, beforeAll, afterAll } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";
import crypto from "crypto"

const now = new Date()
const past = new Date(now.getTime() - 24*60*60*1000)
const future = new Date(now.getTime() + 24*60*60*1000)

const makeHash = (code: string) => crypto.createHash('sha256').update(code).digest('hex')

describe("voucher admin routes and activation", () => {
  const validCode = "ABC123";
  const invalidCode = "WRONG";
  let voucherId: string;

  beforeAll(async () => {
    // ensure clean slate
    await prisma.voucher.deleteMany()

    // seeded valid voucher within date range
    const created = await prisma.voucher.create({
      data: {
        name: "New Year",
        reduceAmount: 10,
        startAt: past,
        expireAt: future,
        activationCode: makeHash(validCode)
      }
    })
    voucherId = created.id

    // expired voucher (to test date window)
    await prisma.voucher.create({
      data: {
        name: "Old Promo",
        reduceAmount: 5,
        startAt: new Date(now.getTime() - 7*24*60*60*1000),
        expireAt: new Date(now.getTime() - 24*60*60*1000),
        activationCode: makeHash("OLD1")
      }
    })
  })

  afterAll(async () => {
    await prisma.voucher.deleteMany()
  })

  test("GET /api/admin/vouchers should list vouchers", async () => {
    const res = await request(app).get("/api/admin/vouchers")
    expect(res.status).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
  })

  test("POST /api/admin/vouchers should create a voucher with hashing and dates", async () => {
    const payload = {
      name: "Spring Sale",
      reductAmount: 15, // validator expects 'reductAmount'
      startAt: past.toISOString(),
      expireAt: future.toISOString(),
      activation_code: "SPRING15"
    }

    const res = await request(app)
      .post("/api/admin/vouchers")
      .type("form")
      .send(payload)
      .set('Accept', 'application/json')

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Create voucher successfully")

    // Verify in DB that activationCode is stored hashed and not raw
    const saved = await prisma.voucher.findFirst({ where: { name: "Spring Sale" } })
    expect(saved).toBeTruthy()
    expect(saved?.activationCode).toBe(makeHash("SPRING15"))
  })

  test("PUT /api/admin/vouchers/:id should update voucher and re-hash activation code", async () => {
    const res = await request(app)
      .put(`/api/admin/vouchers/${voucherId}`)
      .type("form")
      .send({
        name: "New Year Updated",
        reductAmount: 20,
        startAt: past.toISOString(),
        expireAt: future.toISOString(),
        activation_code: "ABC456"
      })
      .set('Accept', 'application/json')

    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Update voucher successfully")

    const refreshed = await prisma.voucher.findUnique({ where: { id: voucherId } })
    expect(refreshed?.name).toBe("New Year Updated")
    expect(refreshed?.reduceAmount).toBe(20)
    expect(refreshed?.activationCode).toBe(makeHash("ABC456"))
  })

  test("DELETE /api/admin/vouchers/:id should remove a voucher", async () => {
    const toDelete = await prisma.voucher.create({
      data: {
        name: "Temp",
        reduceAmount: 1,
        startAt: past,
        expireAt: future,
        activationCode: makeHash("TMP")
      }
    })

    const res = await request(app).delete(`/api/admin/vouchers/${toDelete.id}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Success")

    const exists = await prisma.voucher.findUnique({ where: { id: toDelete.id } })
    expect(exists).toBeNull()
  })

  test("POST /api/admin/vouchers/activate should succeed with valid code in date window and fail otherwise", async () => {
    // Success with valid code
    const ok = await request(app)
      .post("/api/admin/vouchers/activate")
      .type("form")
      .send({ voucher_code: validCode })
      .set('Accept', 'application/json')

    expect(ok.status).toBe(200)
    expect(ok.body.message).toBe("Add voucher successfully")
    expect(ok.body.voucher).toEqual({ name: "New Year Updated", reduceAmount: 20 })

    // Fail with wrong code
    const wrong = await request(app)
      .post("/api/admin/vouchers/activate")
      .type("form")
      .send({ voucher_code: invalidCode })
      .set('Accept', 'application/json')

    expect(wrong.status).toBe(401)
    expect(wrong.body.message).toBe("No voucher with that activate code exists")
  })
})
