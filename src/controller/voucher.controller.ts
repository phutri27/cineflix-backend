import type { Request, Response, NextFunction } from "express";
import { voucherObj, type VoucherProp, type VoucherData } from "../dao/vouchers.dao";
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
        const userId = String(req.user?.id)
        const { voucher_code }: {voucher_code: string} = matchedData(req)
        const voucherIds: {id: string, quantity: number}[]  = req.body.voucherIds
        const hashed_code = crypto.createHash('sha256').update(voucher_code).digest('hex')
        const voucher = await voucherObj.compareVoucher(hashed_code)
        if (voucher){
            if (voucherIds){
                const foundVoucher = voucherIds.find((voucher) => voucher.id === voucher.id)
                if (foundVoucher && (foundVoucher?.quantity >= voucher.maxUsed)){
                    return res.status(400).json({message: "Limit exceeded"})
                }
            }
            return res.status(200).json(voucher)

        } 
        return res.status(400).json({ message: "Incorrect voucher code" })
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
        await voucherObj.update(id, data as VoucherData)
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