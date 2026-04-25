import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { profileObj } from "../dao/profile.dao";
import { isValid } from "../utils/password.util";
import crypto from 'crypto'
import { voucherObj } from "../dao/vouchers.dao";
export const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const profile = await profileObj.getProfile(userId)
        res.status(200).json(profile)
    } catch (error) {
        return next(error)
    }
}

export const editCustomerProfile = async( req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { password, first_name, last_name } = matchedData(req)
        const userHashedpassword = await profileObj.getPasswordByUserId(userId)
        const valid = await isValid(password, userHashedpassword as string)
        if (!valid){
            return res.status(400).json({
                message: "Incorrect password"
            })
        }
        const newProfile = await profileObj.editProfile(userId, first_name, last_name)
        return res.status(200).json({
            message: "Success",
            profile: newProfile
        })
    } catch (error) {
        return next(error)
    }
}

export const getBookingHistory = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id as string
        const page = Number(req.params.page)
        const bookingHistory = await profileObj.getBookingHistory(userId, page)
        return res.status(200).json(bookingHistory)
    } catch (error){
        return next(error)
    }
}

export const getProfileVouchers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = String(req.user?.id)
        const { page } = req.query
        const vouchers = await profileObj.getProfileVouchers(userId, Number(page))
        return res.status(200).json(vouchers)
    } catch (error) {
        next(error)
    }
}

export const insertVoucherIntoProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = String(req.user?.id) 
        const { voucher_code } = matchedData(req)
        const hashed_code = crypto.createHash('sha256').update(voucher_code).digest('hex')
        const voucher = await voucherObj.compareVoucher(hashed_code)
        const voucherQuantity = await voucherObj.getUserVoucherQuantity(userId, voucher?.id!) || 0
        if (voucher && voucherQuantity < voucher.maxUsed){
            await voucherObj.addVoucherToProfile(userId, voucher.id)
            return res.status(200).json(voucher)
        }
        if (voucherQuantity >= Number(voucher?.maxUsed) ){
            return res.status(400).json({ message: "Limit exceeded" })
        }
        return res.status(400).json({ message: "Incorect code" })
    } catch (error) {
        next(error)
    }
}