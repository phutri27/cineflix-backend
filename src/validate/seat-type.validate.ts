import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";
const emptyMsg = "must not be empty"

export const seatTypeValidate = [
    body("price")
    .notEmpty()
    .withMessage(`Price ${emptyMsg}`)
    .isInt({ gt: -1 })
    .withMessage(`Price must only be numbers`),

    body("seat_type")
    .notEmpty()
    .withMessage(`Seat type ${emptyMsg}`)
    .custom(async (value, {req}) => {
        const data = await prisma.seatTypeDetail.findFirst({
            where:{
                seat_type: {
                    equals: value,
                    mode: "insensitive"
                },
                cinemaId: req.body.cinemaId
            }
        })

        if (data) {
            throw new Error(`Seat type already exists for this cinema`);
        }
    }),

    body("cinemaId")
    .notEmpty()
    .withMessage(`Cinema ${emptyMsg}`)
]