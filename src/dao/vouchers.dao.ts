import { prisma } from "../lib/prisma";

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
                    }}
                ]
            }, 
            select:{
                name: true,
                reduceAmount: true
            }
        })
        return voucherCode
    }

    async insert(name: string, reduceAmount: number, startAt: Date, expireAt: Date, activationCode: string){
        await prisma.voucher.create({
            data:{
                name: name,
                reduceAmount: reduceAmount,
                startAt: startAt,
                expireAt: expireAt,
                activationCode: activationCode
            }
        })
    }

    async update(id: string, name: string, reduceAmount: number, startAt: Date, expireAt: Date, activationCode: string){
        await prisma.voucher.update({
            data:{
                name: name,
                reduceAmount: reduceAmount,
                startAt: startAt,
                expireAt: expireAt,
                activationCode: activationCode
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