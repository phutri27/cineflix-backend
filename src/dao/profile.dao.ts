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
}

export const profileObj = new Profile()