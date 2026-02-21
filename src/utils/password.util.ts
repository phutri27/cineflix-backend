import bcrypt from 'bcrypt'

export const isValid = (password: string, hashed_password: string) => {
    const match = bcrypt.compare(password, hashed_password)
    return match
}   