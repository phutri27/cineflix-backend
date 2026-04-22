import crypto from "crypto"

export const generateSecureToken = (length: number) => {
    const randomBytes = crypto.randomBytes(length)
    const token = randomBytes.toString("hex")

    return token
}