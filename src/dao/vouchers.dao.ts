import { prisma } from "../lib/prisma";
import type { VoucherData, VoucherProp } from "../types/voucher-types";
class Vouchers{
    async getAllVouchers(){
        const vouchers = await prisma.voucher.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        })
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
                reduceAmount: true,
                maxUsed: true
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
                reduceAmount: Number(data.reduceAmount),
                startAt: new Date(data.startAt),
                expireAt: new Date(data.expireAt),
                quantity: Number(data.quantity),
                activationCode: data.activationCode,
                maxUsed: Number(data.maxUsed)
            }
        })
    }

    async update(id: string, data: VoucherData){
        await prisma.voucher.update({
            data:{
                name: data.name,
                reduceAmount: Number(data.reduceAmount),
                startAt: new Date(data.startAt),
                expireAt: new Date(data.expireAt),
                quantity: Number(data.quantity),
                maxUsed: data.maxUsed
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

    async addVoucherToProfile(userId: string, voucherId: string){
        await prisma.$transaction([
            prisma.profileVoucher.upsert({
                where:{
                    userId_voucherId:{
                        userId: userId,
                        voucherId: voucherId
                    }
                },
                update:{
                    quantity:{
                        increment: 1
                    }
                },
                create:{
                    userId: userId,
                    voucherId: voucherId
                }
            }),
            prisma.voucher.update({
                where:{
                    id: voucherId
                },
                data:{
                    quantity:{
                        decrement: 1
                    }
                }
            })
        ])
    }

    async getUserVoucherQuantity(userId: string, voucherId: string){
        const response = await prisma.profileVoucher.findUnique({
            where:{
                userId_voucherId: {
                    userId: userId,
                    voucherId: voucherId
                }
            },
            select:{
                quantity: true
            }
        })

        return response?.quantity
    }
}

export const voucherObj = new Vouchers()