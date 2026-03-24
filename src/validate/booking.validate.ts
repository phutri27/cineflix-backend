import { body } from "express-validator";

export const bookingValidation = [
    body("data").notEmpty().withMessage("Booking data is required"),
    body("data.movieId").notEmpty().withMessage("Movie ID is required"),
    body("data.showtimeId").notEmpty().withMessage("Showtime ID is required"),
    body("data.totalAmount").isNumeric().withMessage("Total amount must be a number"),
    body("seatIds").isArray({min: 1}).withMessage("At least one seat must be selected")
]

export const statusValidate = [
    body("status").notEmpty().withMessage("Status must not be empty")
    .custom((value, {req}) => {
        if (value !== "PENDING" && value !== "CONFIRMED" && value !== "FAILED" && value !== "CANCELLED"){
            throw new Error("Booking status is not valid")
        }
        return true
    })
]