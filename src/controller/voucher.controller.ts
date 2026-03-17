import type { Request, Response, NextFunction } from "express";
import { voucherObj, type VoucherProp } from "../dao/vouchers.dao";
import { matchedData } from "express-validator";
import crypto from "crypto"

export const getAllVouchers =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vouchers = await voucherObj.getAllVouchers()
        return res.status(200).json(vouchers)
    } catch (error) {
        return next(error)
    }
}

export const activateVouchers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { voucher_code } = matchedData(req)
        const hashed_code = crypto.createHash('sha256').update(voucher_code).digest('hex')
        const voucher = await voucherObj.compareVoucher(hashed_code)
        if (voucher){
            await voucherObj.reduceQuantity(voucher.id)
            return res.status(200).json({
                message: "Add voucher successfully",
                voucher
            })
        } 
        return res.status(401).json({
            message: "No voucher with that activate code exists"
        })
    } catch (error) {
        return next(error)
    }
}

export const insertVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = matchedData(req)
        const hashed_code = crypto.createHash('sha256').update(data.activationCode).digest('hex')
        Object.assign(data, {activationCode: hashed_code})
        await voucherObj.insert(data as VoucherProp)
        return res.status(200).json({
            message: "Create voucher successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const updateVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const data = matchedData(req)
        const hashed_code = crypto.createHash('sha256').update(data.activationCode).digest('hex')
        Object.assign(data, {activationCode: hashed_code})
        await voucherObj.update(id, data as VoucherProp)
        return res.status(200).json({
            message: "Update voucher successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const deleteVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await voucherObj.delete(id)
        return res.status(200).json({
            message: "Success"
        })
    } catch (error) {
        return next(error)
    }

}