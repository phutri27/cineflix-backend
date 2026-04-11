import { toUSVString } from "node:util";
import { prisma } from "../lib/prisma.js";

class Profile{
    async getProfile(userId: string){
        const profile = await prisma.profile.findUnique({
            where:{
                userId: userId
            },
        })
        return profile
    }

    async getBookingHistory(userId: string, page: number = 1, limit: number = 5){
        const skipAmount = (page - 1) * limit

        const totalBookings = await prisma.booking.count({
            where:{
                userId: userId
            }
        })

        const bookingHistory =  await prisma.booking.findMany({
            where:{
                userId: userId
            },
            orderBy:{
                createdAt: "desc"
            },
            take: limit,
            skip: skipAmount,
            select:{
                id: true,
                totalAmount: true,
                createdAt: true,
                bankReference: true,
                status: true,
                movie:{
                    select:{
                        title: true,
                        posterUrl: true
                    }
                },
                showtime:{
                    select:{
                        startTime: true
                    }
                },
                vouchers:{
                    select:{
                        quantity: true,
                        voucher:{
                            select:{
                                name: true,
                                reduceAmount: true,
                            }
                        }
                    }
                },
                tickets:{
                    select:{
                        seat:{
                            select:{
                                row: true,
                                number: true,
                                seatTypeDetail:{
                                    select:{
                                        seat_type: true,
                                        price: true
                                    }
                                },
                                screen:{
                                    select:{
                                        name: true,
                                        cinema:{
                                            select:{
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                snacks:{
                    select:{
                        quantity: true,
                        snack:{
                            select:{
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        })
        return {
            data: bookingHistory,
            meta:{
                currentPage: page,
                totalPages: Math.ceil(totalBookings / limit),
                totalItems: totalBookings
            }
        }
    }

    async createProfile(userId: string){
        await prisma.profile.create({
            data:{
                userId: userId
            }
        })
    }

    async getPasswordByUserId(userId: string){
        const user = await prisma.user.findUnique({
            where:{
                id: userId
            },
            select:{
                hashed_password: true
            }
        })
        return user?.hashed_password
    }

    async editProfile(userId: string, first_name: string, last_name: string){
        const editedProfile = await prisma.user.update({
            data:{
                first_name: first_name,
                last_name: last_name
            },
            where:{
                id: userId
            }
        })
        return editedProfile
    }

    async updateProfileSpending(amount: number, userId: string) {
        const response = await prisma.profile.update({
            where:{
                userId: userId
            },
            data:{
                spending_total: {
                    increment: amount
                }
            }
        })


        if (response.member_rank === "diamond"){
            return
        }
        if (response.spending_total.toNumber() >= 5000000 && response.member_rank === "copper"){
            await prisma.profile.update({
                where:{
                    userId: userId
                },
                data:{
                    member_rank: "silver"
                }
            })
        } else if (response.spending_total.toNumber() >= 10000000 && response.member_rank === "silver"){
            await prisma.profile.update({
                where:{
                    userId: userId
                },
                data:{
                    member_rank: "gold"
                }
            })
        } else if (response.spending_total.toNumber() >= 10000000 && response.member_rank === "silver"){
            await prisma.profile.update({
                where:{
                    userId: userId
                },
                data:{
                    member_rank: "gold"
                }
            })
        } else if (response.spending_total.toNumber() >= 20000000 && response.member_rank === "gold"){
            await prisma.profile.update({
                where:{
                    userId: userId
                },
                data:{
                    member_rank: "diamond"
                }
            })
        }
    }
}

export const profileObj = new Profile()