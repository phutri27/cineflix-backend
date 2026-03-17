import { prisma } from "../lib/prisma";

export interface VoucherProp{
    name: string,
    reduceAmount: number,
    quantity: number,
    startAt: Date,
    expireAt: Date,
    activationCode: string
}
class Vouchers{
    async getAllVouchers(){
        const vouchers = await prisma.voucher.findMany()
        return vouchers
    }

    async compareVoucher(activationCode: string){
        const date = new Date()
        const voucherCode = await prisma.voucher.findFirst({
            where: {
                AND:[
                    {activationCode: activationCode},
                    {startAt: {
                        lte: date
                    }},
                    {expireAt: {
                        gte: date
                    }},
                    {quantity: {
                        gt: 0
                    }}
                ]
            }, 
            select:{
                id: true,
                name: true,
                reduceAmount: true
            }
        })
        return voucherCode
    }

    async reduceQuantity(id: string){
        await prisma.voucher.update({
            where:{
                id: id
            },
            data:{
                quantity: {
                    decrement: 1
                }
            }
        })
    }

    async insert(data: VoucherProp){
        await prisma.voucher.create({
            data:{
                name: data.name,
                reduceAmount: data.reduceAmount,
                startAt: data.startAt,
                expireAt: data.expireAt,
                quantity: data.quantity,
                activationCode: data.activationCode
            }
        })
    }

    async update(id: string, data: VoucherProp){
        await prisma.voucher.update({
            data:{
                name: data.name,
                reduceAmount: data.reduceAmount,
                startAt: data.startAt,
                expireAt: data.expireAt,
                activationCode: data.activationCode,
                quantity: data.quantity
            },
            where:{
                id: id
            }
        })
    }

    async delete(id: string){
        await prisma.voucher.delete({
            where:{
                id: id
            }
        })
    }
}

export const voucherObj = new Vouchers()