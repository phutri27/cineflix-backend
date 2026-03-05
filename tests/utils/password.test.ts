import { expect, test, beforeEach, vi } from "vitest";
import bcrypt from 'bcrypt'
import { isValid, genPassword } from "../../src/utils/password.util";

vi.mock('bcrypt', () => ({
    default:{
        compare: vi.fn(),
        hash: vi.fn()
    }
}))

beforeEach(() => {
    vi.clearAllMocks()
})

test("Test isValid function", async () => {
    const compareVal = true
    vi.mocked(bcrypt.compare).mockResolvedValue(compareVal as any)

    const result = await isValid('123456', 'dasijdsaoidoiqjd$21421dj')

    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'dasijdsaoidoiqjd$21421dj')
    expect(result).toBeTruthy
})

test("Test genpassword function", async () => {
    const hashedPass = "ji13jfi091930213i21kdkl1d#23*$&@(!$WJdkadasd"
    vi.mocked(bcrypt.hash).mockResolvedValue(hashedPass as any)

    const result  = await genPassword("123456")

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 15)
    expect(result).toBe(hashedPass)
})

